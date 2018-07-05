using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Models;
using ProjectManagementTool.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Controllers.ApiControllers
{
    public abstract class _BaseController : Controller
    {
        protected readonly ApplicationDbContext _context;
        protected readonly UserManager<ApplicationUser> _userManager;
        protected Task<ApplicationUser> GetCurrentUserAsync()
        {
            return _userManager.GetUserAsync(HttpContext.User);
        }

        public _BaseController(ApplicationDbContext context, UserManager<ApplicationUser> manager)
        {
            _context = context;
            _userManager = manager;
        }

        public async Task<bool> EnsureAuthorizedAccessAsync(_ProtectedTable pt, bool throwException=true)
        {
            var currentUser = await GetCurrentUserAsync();
            if (pt.OwnerId != currentUser.Id && pt.OwnerId != null && pt.OwnerId != "")
            {
                if (throwException)
                {
                    throw new Exception("Unauthorized access to data");
                }
                return false;
            }
            return true;
        }

        public async Task<bool> EnsureAuthorizedAccessAsync(IEnumerable<_ProtectedTable> pt, bool throwException = true)
        {
            var currentUser = await GetCurrentUserAsync();
            foreach(var o in pt)
            {
                if (o.OwnerId != currentUser.Id && o.OwnerId != null && o.OwnerId != "")
                {
                    if (throwException)
                    {
                        throw new Exception("Unauthorized access to data");
                    }
                    return false;
                }
            }
            return true;
        }
    }
}
