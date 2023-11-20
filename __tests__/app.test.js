const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const { convertTimeStampToDate } = require('../db/seeds/utils')

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
})
