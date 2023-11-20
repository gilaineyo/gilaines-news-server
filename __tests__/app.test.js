const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')

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
            expect(endpoints).toMatchObject({
                "GET /api": { "description": expect.any(String) },
                "GET /api/topics": { "description": expect.any(String), "queries": [], "exampleResponse": { "topics": [{ "slug": expect.any(String), "description": expect.any(String) }] }},
            })
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