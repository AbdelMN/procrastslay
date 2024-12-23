import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  DrawerBody,
  Icon,
} from '@chakra-ui/react';
import { SiWwise } from 'react-icons/si';
import { useSidenav } from './sidenav-context/sidenav-context';
import SidenavItems, { SidenavItem } from './sidenav-items/sidenav-items';

export interface SidenavProps {
  navItems: SidenavItem[];
}

export function Sidenav({ navItems }: SidenavProps) {
  const { isOpen, onClose } = useSidenav();
  return (
    <React.Fragment>
      <VStack spacing="5" as="nav" display={{ base: 'none', md: 'flex' }}>
        <Icon as={SiWwise} boxSize={8} /> {/*OR PUT YOUR LOGO HERE */}
        <SidenavItems navItems={navItems} />
      </VStack>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Sidenav Header</DrawerHeader>
          <DrawerBody>
            <SidenavItems navItems={navItems} mode="over" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
}

export default Sidenav;
