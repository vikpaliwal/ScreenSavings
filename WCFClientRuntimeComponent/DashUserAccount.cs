using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Threading.Tasks;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace WCFClientRuntimeComponent
{
    [DataContract]
    class UserAccount
    {
        UserProfile Profile;
        UserAccount()
        { 
        
        }
    }

    class UserProfile
    {
        UserProfile()
        { 
        
        }
    }

    class UserID
    {
        UserID()
        { 
        
        }
    }
}
