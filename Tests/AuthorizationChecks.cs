using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Net;
using System.Threading.Tasks;
using Xunit;

//https://github.com/aspnet/Docs/blob/master/aspnetcore/test/integration-tests/samples/2.x/IntegrationTestsSample/tests/RazorPagesProject.Tests/IntegrationTests/BasicTests.cs

namespace Tests
{
    public class AuthorizationChecks : IClassFixture<WebApplicationFactory<ProjectManagementTool.Program>>
    {
        private readonly WebApplicationFactory<ProjectManagementTool.Program> _factory;

        public AuthorizationChecks(WebApplicationFactory<ProjectManagementTool.Program> factory)
        {
            _factory = factory;
        }

        [Theory]
        [InlineData("api/Projects")]
        [InlineData("api/Columns")]
        [InlineData("api/Links")]
        [InlineData("api/LongTermGoals")]
        [InlineData("api/TodoTasks")]
        public async Task API_EndpointsWithPrivateDataWontPassWithoutAuthorizationAsync(string value)
        {
            // Arrange
            var client = _factory.CreateClient(
                new WebApplicationFactoryClientOptions
                {
                    AllowAutoRedirect = false
                });

            // Act
            var response = await client.GetAsync(value);

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}
