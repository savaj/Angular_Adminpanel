export class GlobalConstants {
    public static apiURL: string = "/api/";
    public static authText: string = "Authorization";
    public static bearerText: string = 'Bearer ';
    public static token: string = 'token';
    public static deleteConfirmMessage: string = "Are you sure to delete?";
    public static yes: string = "Yes";
    public static no: string = "No";

    public static back: string = "Back";
    public static save: string = "Save";
    public static bindmenu: string = "Bind Menu";
    public static savemenu: string = "Save Menu";
    public static reset: string = "Reset";
    public static status: string = "Status";
    public static action: string = "Action";
    public static user_heading: string = "Users";
    public static role_heading: string = "Roles";
    public static resource_heading: string = "Resources";
    public static rightmasterHeading:string = "Rights";
    public static menuHeading: string = "Menus";
    public static user = {
        addUser: 'Add User',
        editUser: 'Edit User',
        usersListing: 'Users Listing',
        userPersonalDetailsHeading: 'Personal Details',
        userDepartmentDetailsHeading: 'Department Details',
        validmobile: 'Please Enter Valid Mobile Number',
        validEmail: 'Please Enter Valid mail',
        userSafeMessage: 'User is Safe',
        field: {
            id: 'id',
            firstname: 'First Name',
            lastname: 'Last Name',
            email: 'E-mail',
            mobilenumber: 'Mobile Number',
            designation: 'Designation',
            department: 'Department',
            hod: 'HOD',
            branch: 'Branch'
        },
        required: {
            firstname: 'Firstname is required',
            lastname: 'Lastname is required',
            email: 'Email is required',
            mobilenumber: 'Mobile Number is required',
            designation: 'Designation is required',
            department: 'Department is required',
            hod: 'HOD is required',
            branch: 'Branch is required'
        }
        
        
    }

    public static role = {
        addRole: 'Add Role',
        editRole: 'Edit Role',
        rolesListing: 'Roles Listing',
        roleSafeMessage: 'Role is Safe',
        field: {
            id: 'id',
            rolename: 'Role Name'
        },
        required: {
            rolename: 'Rolename is required',
        }
    }

    public static resource = {
        addResource: 'Add Resource',
        editResource: 'Edit Resource',
        resourcesListing: 'Resources Listing',
        resourceSafeMessage: 'Resource is Safe',
        field: {
            resourcename: 'Resource Name',
            resourceurl: 'Resource Url',
        },
        required: {
            resourcename: 'Resourcename is required',
            resourceurl: 'Resourceurl is required',
        }
    }

    public static right = {
        field: {
            resourcename: 'Resource Name',
            resourceurl: 'Resource Url',
            insert: 'Insert',
            edit: 'Edit',
            view: 'View',
            delete: 'Delete',
            menuname: 'Menu Name',
            rolename: 'Role Name'
        },
        required: {
            resourcename: 'Resource Name is required',
            menuname: 'Menu Name is required'
        }
    }


    public static menu = {
        addMenu: 'Add Menu',
        editMenu: 'Edit Menu',
        menusListing: 'Menus Listing',
        menuSafeMessage: 'Menu is Safe',
        field: {
            menuname: 'Menu Name',
            menuResource: 'Menu Resource',
            menutype: 'Menu Type',
            ChildMenu: 'Child Menu'
        },
        required: {
            menuname: 'Menu Name is required',
            menuResource: 'Menu Resource is required',
            menuType: 'Menu Type is required',
            ChildMenu: 'Child Menu is required'
        }
    }
}