using Microsoft.AspNetCore.Builder;

namespace Tetromini
{
    public class Startup
    {
        public void Configure(IApplicationBuilder app)
        {
            app.Use(async (context, next) => {
                if (context.Request.Path.Value == "/")
                {
                    context.Request.Path = "/firsttetrisever.html";
                }
                await next();
            });
            app.UseStaticFiles();
        }
    }
}
