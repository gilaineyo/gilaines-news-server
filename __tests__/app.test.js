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

describe('/api/articles', () => {
    test('GET 200 - responds with an array of article objects sorted in descending date order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(Array.isArray(articles)).toBe(true)
            expect(articles).toHaveLength(13)
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
})
