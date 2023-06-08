export class GlobalConstants {
    public static apiURL: string = "/api/";
    public static authText: string = "Authorization";
    public static authorizationUserText: string = "auth.user";
    public static authorizationPassText: string = "auth.pass";
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
    public static bankHeading: string = "Bank Guarantees";
    public static vendorsHeading: string = "Vendors";
    public static tendorsHeading: string = "Tenders";

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

    public static bank = {
        addBank: 'Add BankGuarantee',
        editBank: 'Edit BankGuarantee',
        banksListing: 'BankGuarantee Listing',
        bankSafeMessage: 'BankGuarantee is Safe',
        field: {
            bankname: 'Bank Name',
            bankbranch: 'Bank Branch',
            bankifsccode: 'Bank IFSC Code',
            bankCheckNumber: 'Check Number',
            bankDDNumber: 'DD Number',
            bankNeftNumber: 'Transaction number',
            bankaddress: 'Bank Address',
            bankvalidtilldate: 'Valid till date',
            companyname: 'Company Name',
            bg_number: 'Bg Number',
            file_no: 'File Number',
            tendor: 'Tender',
            vendor: 'Vendor',
            remarks: 'Remarks',
            bg_doc: 'BG Documents',
            amount: 'Amount',
            bg_type: 'BG Type',
        },
        required: {
            bankname: 'Bank Name is required',
            bankbranch: 'Bank Branch is required',
            bankifsccode: 'Bank IFSC Code is required',
            bankaddress: 'Bank Address is required',
            bankvalidtilldate: 'Valid till date is required',
            companyname: 'Company Name is required',
            bg_number: 'Bg Number is required',
            file_no: 'File Number is required',
            tendor: 'Tender is required',
            vendor: 'Vendor is required',
            remarks: 'Remarks is required',
            bg_doc: 'Please upload file',
            amount: 'Amount is required',
            bg_type: 'BG Type is required',
            bankCheckNumber: 'Check Number is required',
            bankDDNumber: 'DD Number is required',
            bankNeftNumber: 'Transaction Number is required'
        },
        maxLength: {
            bankCheckNumber_maxLen: 'Bank Check Number max length 5 digit',
            bankDDNumber_maxLen: 'Bank DD Number max length 5 digit',
            bankNEFTNumber_maxLen: 'Bank Transaction Number max length 5 digit'
        },
        amount_minlength: "Please enter minimum 5 digit",
        amount_maxlength: "Please enter maximum 10 digit",
    }

    public static flow = {
        flowSafeMessage: 'FlowData is Safe',
    }

    public static vendor = {
        addVendor: 'Add Vendor',
        editVendor: 'Edit Vendor',
        vendorsListing: 'Vendors Listing',
        validEmail: 'Please Enter Valid mail',
        validMobileNo: 'Please Enter Valid mobile no',
        field: {
            id: 'id',
            vendorname: 'Company Name',
            vendorAddress: 'Company Address',
            contact_person_name: 'Contact Person Name',
            contact_person_email: 'Contact Person Email',
            contact_person_mobile_no: 'Contact Person Mobile No'
        },
        required: {
            vendorname: 'Company Name is required',
            vendorAddress: 'Company Address is required',
            contact_person_name: 'Contact Person Name is required',
            contact_person_email: 'Contact Person Email is required',
            contact_person_mobile_no: 'Contact Person Mobile No is required'
        }  
    }

    public static tendor = {
        addTendor: 'Add Tender',
        editTendor: 'Edit Tender',
        tendorsListing: 'Tenders Listing',
        field: {
            id: 'id',
            tendor_name: 'Tender Name',
            tendor_number: 'Tender Number',
            tendor_document: 'Tender Document',
            work_order_issue_date: 'Work Order Issue Date',
            work_order_no: 'Work Order No',
            work_order_document: 'Work Order Document'
        },
        required: {
            tendor_name: 'Tender Name is required',
            tendor_number: 'Tender Number is required',
            tendor_document: 'Please select Tender Document',
            work_order_issue_date: 'Work Order issue date is required',
            work_order_no: 'Work Order No is required',
            work_order_document: 'Please select Work Order Document'
        }  
    }
}