/**
 * 最初步的使用
 */

$.ajax({
  url: 'http://localhost:8080/ok',
  type: 'get',
  success: function (res) {
    console.log(res);
  },
  error: function (err) {
    console.log(err);
  },
});
