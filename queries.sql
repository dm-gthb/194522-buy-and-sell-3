-- Получить список всех категорий (идентификатор, наименование категории);
SELECT * FROM categories;

-- Получить список категорий для которых создано минимум одно объявление (идентификатор, наименование категории);
SELECT id, name
FROM categories
INNER JOIN offer_categories ON categories.id = offer_categories.category_id
GROUP BY categories.id

-- Получить список категорий с количеством объявлений (идентификатор, наименование категории, количество объявлений в категории);
SELECT
  categories.id,
  categories.name,
  count(offer_categories.offer_id)
FROM categories
LEFT JOIN offer_categories ON categories.id = offer_categories.category_id
GROUP BY categories.id

-- Получить список объявлений (идентификатор объявления, заголовок объявления, стоимость, тип объявления, текст объявления, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие объявления;
SELECT
  offers.id,
  offers.title,
  offers.sum,
  offers.type,
  offers.description,
  offers.created_at,
  users.first_name,
  users.last_name,
  users.email,
  count(comments.id),
  STRING_AGG(DISTINCT categories.name, ', ')
FROM offers
LEFT JOIN users ON offers.user_id = users.id
LEFT JOIN comments ON offers.id = comments.offer_id
LEFT JOIN offer_categories ON offers.id = offer_categories.offer_id
LEFT JOIN categories ON categories.id = offer_categories.category_id
GROUP BY offers.id, users.id
ORDER BY offers.created_at DESC

-- Получить полную информацию определённого объявления (идентификатор объявления, заголовок объявления, стоимость, тип объявления, текст объявления, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий);
SELECT
  offers.id,
  offers.title,
  offers.sum,
  offers.type,
  offers.description,
  offers.created_at,
  users.first_name,
  users.last_name,
  users.email,
  count(comments.id),
  STRING_AGG(DISTINCT categories.name, ', ')
FROM offers
LEFT JOIN users ON offers.user_id = users.id
LEFT JOIN comments ON offers.id = comments.offer_id
LEFT JOIN offer_categories ON offers.id = offer_categories.offer_id
LEFT JOIN categories ON categories.id = offer_categories.category_id
WHERE offers.id = 1
GROUP BY offers.id, users.id

-- Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария);
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
LEFT JOIN users ON comments.user_id = users.id
ORDER BY (comments.created_at) DESC
LIMIT 5

-- Получить список комментариев для определённого объявления (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария). Сначала новые комментарии;
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
INNER JOIN users ON comments.user_id = users.id
WHERE comments.offer_id = 1
ORDER BY comments.created_at DESC

-- Выбрать 2 объявления, соответствующих типу «куплю»;
SELECT *
FROM offers
WHERE offers.type = 'offer'
LIMIT 2

-- Обновить заголовок определённого объявления на «Уникальное предложение!»;
UPDATE offers
SET title = 'Уникальное предложение!'
WHERE offers.id = 1;
