import { Card, HStack, VStack } from '@chakra-ui/react';
import { BsTrainFrontFill } from 'react-icons/bs';
import { GiPathDistance } from 'react-icons/gi';
import { BsFuelPumpFill } from 'react-icons/bs';
import { BsSpeedometer2 } from 'react-icons/bs';
const TrainCard = () => {
  return (
    <Card.Root width={'320px'}>
      <Card.Body>
        <VStack gap={5}>
          <BsTrainFrontFill size={'20%'} />
          <VStack>
            <HStack>
              <BsFuelPumpFill /> : 60
            </HStack>
            <HStack>
              <GiPathDistance />: 1230km
            </HStack>
            <HStack>
              <BsSpeedometer2 />: 250km/h
            </HStack>
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export default TrainCard;
