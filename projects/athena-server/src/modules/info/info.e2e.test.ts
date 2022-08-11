import {TestHelper} from "../../../tests/e2e/test-helper";
import {HTTPStatusCodes} from "@kangojs/core";


describe('Info Module',() => {
  const testHelper = new TestHelper();

  afterAll(async () => {await testHelper.afterAll()});
  beforeEach(async () => {await testHelper.beforeEach()});

  /**
   * Base Route (/)
   */
  describe('/v1/info [GET]', () => {
    test('When a request is made, the response should be info message', async () => {
      const {body, statusCode} = await testHelper.client.get('/v1/info');

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expect.objectContaining({
        version: expect.any(String),
        registration: expect.any(Boolean)
      }));
    })

    // When a request is made without authorization, Then the responses should still succeed
    // This is naturally tested as part of the above data.
  })
})