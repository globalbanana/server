import {getAccessToken} from '../module/facebook'

describe('Facebook module', () => {
  it('GET AccessToken', () => {
      const _at= getAccessToken()
      expect(_at).toBe(1);
  })
})
