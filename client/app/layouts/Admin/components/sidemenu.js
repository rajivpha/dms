import React from 'react';

import {
  FaChartPie,

  FaFileAlt,
  FaImages,
  FaShieldAlt,
  FaSitemap,
  FaUserShield,
  FaBoxOpen,
  FaBoxes,
  FaPuzzlePiece,
  FaCogs,
} from 'react-icons/fa';

const menu = [
  {
    key: '1',
    name: 'Dashboard',
    icon: <FaChartPie />,
    link: '/admin/dashboard',
  },
  {
    key: '2',
    name: 'Content',
    icon: <FaFileAlt />,
    menu: [
      {
        key: '2.3',
        name: 'Media',
        icon: <FaImages />,
        link: '/admin/media-manage',
      },
    ],
  },
  {
    key: '3',
    name: 'Access',
    icon: <FaShieldAlt />,
    menu: [
      {
        key: '3.1',
        name: 'Users',
        icon: <FaUserShield />,
        link: '/admin/user-manage',
      },
      {
        key: '3.2',
        name: 'Roles',
        icon: <FaSitemap />,
        link: '/admin/role-manage',
      },
    ],
  },
  {
    key: '6',
    name: 'Modules',
    icon: <FaPuzzlePiece />,
    menu: [
      {
        key: '6.3',
        name: 'Modules',
        icon: <FaBoxOpen />,
        link: '/admin/module-manage',
      },
      {
        key: '6.4',
        name: 'Module Group',
        icon: <FaBoxes />,
        link: '/admin/sub-modules',
      },
    ],
  },
  {
    key: '4',
    name: 'Settings',
    icon: <FaCogs />,
    menu: [
      {
        key: '4.2',
        name: 'Global Settings',
        icon: <FaCogs />,
        link: '/admin/global-setting',
      },
    ],
  },
];
export default menu;
