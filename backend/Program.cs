using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Logging;

var builder = WebApplication.CreateBuilder(args);


if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(
            builder =>
            {
                builder.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002")
                                    .AllowAnyHeader()
                                    .AllowCredentials()
                                    .AllowAnyMethod();
            });
    });
}

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Aggregators config

#region Security config

// builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
//                 .AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"));
// This method gets called by the runtime. Use this method to add services to the container.

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
		   .AddMicrosoftIdentityWebApi(builder.Configuration, subscribeToJwtBearerMiddlewareDiagnosticsEvents: true); // builder.Configuration.GetSection("AzureAd"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // options.AddSecurityDefinition("Bearer", securityScheme);
    // options.AddSecurityRequirement(securityReq);
});

builder.Services.AddAuthorization();

#endregion

#region App config

var app = builder.Build();
IdentityModelEventSource.ShowPII = true;
// Configure the HTTP request pipeline.
if (!app.Environment.IsProduction())
{
    SwaggerBuilderExtensions.UseSwagger(app);
    app.UseSwaggerUI();
}
app.UseForwardedHeaders();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

#endregion

app.MapGet("/account", [Authorize] (HttpContext context) =>
{
	// Start -Error Handling
	return Results.Ok(new { givenName = "James", surname = "Lloyd", userPrincipalName = "userPrinciple", id = "id"});
	// return Results.Ok("foo");
});

app.Run();