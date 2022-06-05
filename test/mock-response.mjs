class Response {
  constructor(statusCode, text, headers = {}) {
    this.statusCode = statusCode
    this.text = text
    this.headers = headers
  }
  pipe(res) {
    this.onResponse && this.onResponse(this)
    res.write(this.text)
    this.onEnd && this.onEnd()
    return this;
  }
}

module.exports = { Response }
