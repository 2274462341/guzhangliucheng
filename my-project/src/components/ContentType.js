module.exports = {
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/x-www-form-urlencoded"
  },
  transformRequest: [
    function (data) {
      return Qs.stringify(data);
    }
  ]
}
