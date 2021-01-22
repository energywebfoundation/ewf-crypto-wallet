import React from 'react';
import styled from 'styled-components';
import { variables } from '@trezor/components';
import { Card, Translation } from '@suite-components';
import Fees from '@wallet-components/Fees';
import { useSendFormContext } from '@wallet-hooks';

const StyledCard = styled(Card)`
    margin-bottom: 25px;
    padding: 32px 42px;
    display: flex;
    flex-direction: row;
    @media all and (max-width: ${variables.SCREEN_SIZE.SM}) {
        flex-direction: column;
    }
`;

const Label = styled.div`
    padding: 5px 20px 10px 0;
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    text-transform: capitalize;
    font-size: ${variables.FONT_SIZE.NORMAL};
    color: ${props => props.theme.TYPE_DARK_GREY};
`;

// wrapper for shareable Fees component
const SendFees = () => {
    const {
        errors,
        register,
        setValue,
        getValues,
        changeFeeLevel,
        account,
        feeInfo,
        composedLevels,
    } = useSendFormContext();

    return (
        <StyledCard>
            <Label>
                <Translation id="FEE" />
            </Label>
            <Fees
                errors={errors}
                register={register}
                feeInfo={feeInfo}
                setValue={setValue}
                getValues={getValues}
                account={account}
                composedLevels={composedLevels}
                changeFeeLevel={changeFeeLevel}
            />
        </StyledCard>
    );
};

export default SendFees;
