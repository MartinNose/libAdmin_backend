let fn_hello = async (ctx, next) => {
    ctx.response.body = `<h1>Hello, ${ctx.params.name}!</h1>`;
};

module.exports = {
    'GET /hello/:name': fn_hello
};