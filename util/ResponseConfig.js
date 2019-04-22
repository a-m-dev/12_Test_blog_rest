

module.exports = {


  success: (code, message = 'result was successful...' , result = {}) => {
    return {
      meta: { code, message },
      data: { ...result, }
    }
  },

  failure: (code, message, result = {}) => {
    return {
      meta: { code, message },
      data: { ...result, }
    }
  }

}
