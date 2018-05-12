using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementTool.Interfaces
{
    /// <summary>
    /// Used when one model depends on other and they both have LastModified value representing similar meaning
    /// </summary>
    interface ILastModificationTracking
    {
        void KeepParentsLastModificationValueUpdated();
    }
}
