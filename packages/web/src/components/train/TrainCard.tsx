import { Card, HStack, Spinner, VStack } from '@chakra-ui/react';
import { BsTrainFrontFill } from 'react-icons/bs';
import { GiPathDistance } from 'react-icons/gi';
import { BsFuelPumpFill } from 'react-icons/bs';
import { BsSpeedometer2 } from 'react-icons/bs';
import { useQuery } from '@tanstack/react-query';
import { trainInfosQuery } from '@/queries/train';

const TrainCard = () => {
  const { data, isPending, isError } = useQuery(trainInfosQuery);

  if (isPending || isError) return <Spinner />;
  return (
    <Card.Root width={'320px'}>
      <Card.Body>
        <VStack gap={5}>
          <BsTrainFrontFill size={'20%'} />
          <VStack>
            <HStack>
              <BsFuelPumpFill /> : {data.fuel}
            </HStack>
            <HStack>
              <GiPathDistance />: {data.kilometer}km
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
