const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const endpointFile = require('../endpoints.json')

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
})

/*
Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your /api endpoint.
*/