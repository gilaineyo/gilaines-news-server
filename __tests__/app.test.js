const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const endpointFile = require('../endpoints.json')
const { selectArticles } = require('../models/app.models')

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api/topics', () => {
    test('GET 200 - responds with array of topic objects, with slug and description properties', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const { topics } = body
            expect(Array.isArray(topics)).toBe(true)
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
})

describe('/api', () => {
    test('GET 200 - responds with a object describing all the endpoints on the API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const { endpoints } = body
            expect(typeof endpoints).toBe('object')
            expect(Array.isArray(endpoints)).toBe(false)
            expect(endpoints).toEqual(endpointFile)
        }) 
    })
})

describe('all', () => {
    test('Error 404 - path not found', () => {
        return request(app)
        .get('/api/toppiks')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Path not found')
        })
    })
})

describe('/api/articles/:article_id', () => {
    test('GET 200 - responds with an article object with correct properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            const { article } = body
            const { author, title, article_id, topic, created_at, votes, article_img_url } = article
            expect(author).toBe("butter_bridge")
            expect(title).toBe("Living in the shadow of a great man")
            expect(article_id).toBe(1)
            expect(article.body).toBe("I find this existence challenging")
            expect(topic).toBe("mitch")
            expect(new Date(created_at)).toEqual(new Date(1594329060000))
            expect(votes).toBe(100)
            expect(article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        })
    })
    test('GET 200 (comment count) - response object contains comment count', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            const { article } = body
            expect(article.comment_count).toBe('11')
        })
    })
    test('GET 200 (comment count) - response object comment count is 0 for article with no comments', () => {
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({body}) => {
            const { article } = body
            expect(article.comment_count).toBe('0')
        })
    })
    test('GET 400 - id malformed', () => {
        return request(app)
        .get('/api/articles/banana')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('GET 404 - article does not exist', () => {
        return request(app)
        .get('/api/articles/99999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article does not exist')
        })
    })
    test('PATCH 200 - article successfully updated', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 27 })
        .expect(200)
        .then(({body}) => {
            const { article } = body
            const { author, title, article_id, topic, created_at, votes, article_img_url } = article
            expect(author).toBe("butter_bridge")
            expect(title).toBe("Living in the shadow of a great man")
            expect(article_id).toBe(1)
            expect(article.body).toBe("I find this existence challenging")
            expect(topic).toBe("mitch")
            expect(new Date(created_at)).toEqual(new Date(1594329060000))
            expect(votes).toBe(127)
            expect(article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        })
    })
    test('PATCH 200 - article downvoted', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: -27 })
        .expect(200)
        .then(({body}) => {
            expect(body.article.votes).toBe(73)
        })
    })
    test('PATCH 400 - votes is not a number (failed schema validation', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'oops' })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('PATCH 400 - article id is invalid', () => {
        return request(app)
        .patch('/api/articles/oops')
        .send({ inc_votes: 27 })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('PATCH 404 - article does not exist', () => {
        return request(app)
        .patch('/api/articles/99999')
        .send({ inc_votes: 27 })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article does not exist')
        })
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('GET 200 - responds with all comments for a given article', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const { comments } = body
            expect(comments).toHaveLength(11)
            expect(comments).toBeSortedBy('created_at', { descending: true })
            comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: 1
                })
            })
        })
    })
    test('GET 200 - responds with empty array for valid article with no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toEqual([])
        })
    })
    test('GET 400 - article ID malformed', () => {
        return request(app)
        .get('/api/articles/banana/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('GET 404 - article does not exist', () => {
        return request(app)
        .get('/api/articles/99999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article does not exist')
        })
    })
})

describe('/api/articles', () => {
    test('GET 200 - responds with an array of article objects sorted in descending date order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(Array.isArray(articles)).toBe(true)
            expect(articles).toHaveLength(10)
            expect(articles).toBeSorted('created_at', { descending: true })
            articles.forEach((article) => {
                const keys = Object.keys(article)
                expect(keys.includes('body')).toBe(false)
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String),
                })
            })
        })
    })
    test('GET 200 - calculates correct comment count', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            const articleOne = articles.indexOf(articles.find((article) => {
                return article.article_id === 1
            }))
            expect(articles[articleOne].comment_count).toBe('11')
        })
    })
    test('GET 200 (topic query) - responds with array of articles filtered by topic', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toHaveLength(1)
            expect(articles[0].topic).toBe('cats')
        })
    })
    test('GET 200 (topic query) - responds with an empty array for topic with no articles', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toEqual([])
        })
    })
    test('GET 404 (topic query) - topic does not exist', () => {
        return request(app)
        .get('/api/articles?topic=banana')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Topic does not exist')
        })
    })
    test('GET 200 - sorts articles by author column', () => {
        return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(10)
            expect(articles).toBeSortedBy('author', { descending: true })
        })
    })
    test('GET 200 - sort articles by votes column (asc)', () => {
        return request(app)
        .get('/api/articles?sort_by=votes&order=asc')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(10)
            expect(articles).toBeSortedBy('votes', { descending: false, coerce: true })
        }) 
    })
    test('GET 200 - sort articles by topic column', () => {
        return request(app)
        .get('/api/articles?sort_by=topic')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(10)
            expect(articles).toBeSortedBy('topic', { descending: true })
        })
    })
    test('GET 200 - sort articles by title (asc)', () => {
        return request(app)
        .get('/api/articles?sort_by=title&order=asc')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(10)
            expect(articles).toBeSortedBy('title')
        })
    })
    test('GET 200 - sort articles by article_img_url (asc)', () => {
        return request(app)
        .get('/api/articles?sort_by=article_img_url')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(10)
            expect(articles).toBeSortedBy('article_img_url', { coerce: true })
        })
    })
    test('GET 200 - sort, order and topic queries all present', () => {
        return request(app)
        .get('/api/articles?topic=mitch&sort_by=author&order=asc')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(10)
            expect(articles).toBeSortedBy('author')
        })
    })
    test('GET 200 - default to created_at desc if sort_by or order value is invalid', () => {
        return request(app)
        .get('/api/articles?sort_by=banana&order=8')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(10)
            expect(articles).toBeSortedBy('created_at', { descending: true })
        })
    })
    test('POST 201 - new article created', () => {
        const newArticle = { author: 'icellusedkars', title: 'my two angels', body: 'Ubik and Mopsy love each other really.', topic: 'cats', article_img_url: "https://cdn.pixabay.com/photo/2015/02/14/10/16/cat-636172_1280.jpg" }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(201)
        .then(({body}) => {
            const { article } = body
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                author: "icellusedkars",
                title: "my two angels",
                body: 'Ubik and Mopsy love each other really.',
                topic: "cats",
                article_img_url: "https://cdn.pixabay.com/photo/2015/02/14/10/16/cat-636172_1280.jpg",
                votes: 0,
                created_at: expect.any(String),
                comment_count: 0
            })
        })
    })
    test('POST 201 - adds default article_img_url if not provided', () => {
        const newArticle = { author: 'icellusedkars', title: 'my two angels', body: 'Ubik and Mopsy love each other really.', topic: 'cats' }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(201)
        .then(({body}) => {
            const { article } = body
            expect(article.article_img_url).toBe("https://pixabay.com/photos/question-question-mark-opinion-poll-2736480/")
        })
    })
    test('POST 400 - author is not a user', () => {
        const newArticle = { author: 'gilaine', title: 'my two angels', body: 'Ubik and Mopsy love each other really.', topic: 'cats', article_img_url: "https://cdn.pixabay.com/photo/2015/02/14/10/16/cat-636172_1280.jpg" }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('User does not exist')
        })
    })
    test('POST 400 - topic is not a valid topic', () => {
        const newArticle = { author: 'icellusedkars', title: 'my two angels', body: 'Ubik and Mopsy love each other really.', topic: 'dogs', article_img_url: "https://cdn.pixabay.com/photo/2015/02/14/10/16/cat-636172_1280.jpg" }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Topic does not exist')
        })
    })
    test('POST 400 - PSQL error: article object malformed', () => {
        const newArticle = { author: "icellusedkars", topic: 'cats', body: "This article is great!" }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('GET 200 - accepts a limit query and responds with limited results', () => {
        return request(app)
        .get('/api/articles?limit=11')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(11)
        })
    })
    test('GET 200 - responds with 10 results if limit not specified', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(10)
        })
    })
    test('GET 200 - accepts a p query to paginate results', () => {
        return request(app)
        .get('/api/articles?limit=5&p=3')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(3)
        })
    })
    test('GET 200 - responds with a total count property', () => {
        return request(app)
        .get('/api/articles?limit=5&p=2')
        .expect(200)
        .then(({body}) => {
            const { articles, total_count } = body
            expect(total_count).toBe('13')
            expect(articles).toHaveLength(5)
        })
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('POST 201 - post a comment to an article', () => {
        const newComment = { username: "icellusedkars", body: "This article is great!" }
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            const { comment } = body
            expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                article_id: 2,
                author: "icellusedkars",
                body: "This article is great!",
                votes: 0,
                created_at: expect.any(String)
            })
        })
    })
    test('POST 400 - PSQL error: comment malformed', () => {
        const newComment = { body: "This article is great!" }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('POST 400 - PSQL error: failed schema validation on article ID', () => {
        const newComment = { username: "icellusedkars", body: "This article is great!" }
        return request(app)
        .post('/api/articles/banana/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        }) 
    })
    test('POST 404 - article does not exist', () => {
        const newComment = { username: "icellusedkars", body: "This article is great!" }
        return request(app)
        .post('/api/articles/99999/comments')
        .send(newComment)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article does not exist')
        })
    })
})

describe('/api/users', () => {
    test('GET 200 - returns array of all users', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const { users } = body
            expect(Array.isArray(users)).toBe(true)
            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})

describe('/api/users/:username', () => {
    test('GET 200 - responds with a user object with correct properties', () => {
        return request(app)
        .get('/api/users/rogersop')
        .expect(200)
        .then(({body}) => {
            const { user } = body
            const { username, name, avatar_url } = user
            expect(username).toBe('rogersop')
            expect(name).toBe('paul')
            expect(avatar_url).toBe('https://avatars2.githubusercontent.com/u/24394918?s=400&v=4')
        })
    })
    test('GET 404 - username does not exist', () => {
        return request(app)
        .get('/api/users/gregdavies')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('User not found')
        })
    })
})

describe('/api/comments/:comment_id', () => {
    test('DELETE 204 - deletes specified comment', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    })
    test('DELETE 404 - comment does not exist', () => {
        return request(app)
        .delete('/api/comments/99999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Comment does not exist')
        })
    })
    test('DELETE 400 - PSQL error: invalid comment ID', () => {
        return request(app)
        .delete('/api/comments/yikes')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })    
    test('PATCH 200 - updates votes on a comment given the comment ID', () => {
        return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({body}) => {
            const { comment } = body
            const { comment_id, votes, created_at, author, article_id } = comment
            expect(comment.body).toBe("Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!")
            expect(comment_id).toBe(1)
            expect(votes).toBe(17)
            expect(new Date(created_at)).toEqual(new Date(1586179020000))
            expect(author).toBe('butter_bridge')
            expect(article_id).toBe(9)
        })
    })
    test('PATCH 200 - comment downvoted', () => {
        return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({body}) => {
            const { comment } = body
            expect(comment.votes).toBe(15)
        })
    })
    test('PATCH 400 - votes is not a number (failed schema validation', () => {
        return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 'oops' })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('PATCH 404 - comment does not exist', () => {
        return request(app)
        .patch('/api/comments/99999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Comment does not exist')
        })
    })
    test('PATCH 400 - PSQL error: invalid comment ID', () => {
        return request(app)
        .patch('/api/comments/yikes')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
})