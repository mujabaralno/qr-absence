export const superAdminNavigation = [
    {
        label: 'Home',
        route: '/superadmin',
        img: '/icons/home.svg'
    },
    {
        label: 'All Organizations',
        route: '/superadmin/all-organizations',
        img: '/icons/home.svg'
    },
    {
        label: 'All User',
        route: '/superadmin/all-user',
        img: '/icons/home.svg'
    },
    {
        label: 'Create Organization',
        route: '/superadmin/create-organization',
        img: '/icons/home.svg'
    },
    {
        label: 'Access Requests',
        route: '/superadmin/access-requests',
        img: '/icons/home.svg'
    },
    {
        label: 'Attendance Monitoring',
        route: '/superadmin/attendance-monitoring',
        img: '/icons/home.svg'
    },
]

export const adminNavigation = [
    {
        label: 'Home',
        route: '/admin',
        img: '/icons/home.svg'
    },
    {
        label: 'Create Session',
        route: '/admin/create-session',
        img: '/icons/home.svg'
    },
    {
        label: 'All Session',
        route: '/admin/all-session',
        img: '/icons/home.svg'
    },
    {
        label: 'Attendance Data',
        route: '/admin/attendance-data',
        img: '/icons/home.svg'
    },
    {
        label: 'Members Management',
        route: '/admin/member-management',
        img: '/icons/home.svg'
    },
    {
        label: 'Setting',
        route: '/admin/setting',
        img: '/icons/home.svg'
    },
]


export const createOrganizationDefaultValues = {
    organizationName: "",
    description: "",
    imageUrl: "",
    responsiblePerson: "",
    origin: ""
};