import { NavigationMenuLinkItem, Sidebar } from 'erxes-ui';
import {
  IconFlask,
  IconSchool,
  IconUsers,
  IconUserStar,
} from '@tabler/icons-react';

const ITEMS = [
  { name: 'Даалгавар ба Lab', icon: IconFlask, path: 'assignments' },
  { name: 'Ангиуд', icon: IconSchool, path: 'classrooms' },
  { name: 'Багш нар', icon: IconUserStar, path: 'teachers' },
  { name: 'Сурагчид', icon: IconUsers, path: 'students' },
];

export const EdulabNavigation = () => {
  return (
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {ITEMS.map((item) => (
            <NavigationMenuLinkItem
              key={item.path}
              name={item.name}
              icon={item.icon}
              pathPrefix="edulab"
              path={item.path}
            />
          ))}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  );
};
