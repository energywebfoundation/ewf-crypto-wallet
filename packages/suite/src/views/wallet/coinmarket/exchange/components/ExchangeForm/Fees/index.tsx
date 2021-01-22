import React from 'react';
import styled from 'styled-components';
import { variables } from '@trezor/components';
import { Translation } from '@suite-components';
import Fees from '@wallet-components/Fees';
import { useCoinmarketExchangeFormContext } from '@wallet-hooks/useCoinmarketExchangeForm';
import { PrecomposedLevels } from '@wallet-types/sendForm';

const StyledCard = styled.div`
    display: flex;
    justify-items: space-between;
    margin: 25px 0;

    @media all and (max-width: ${variables.SCREEN_SIZE.SM}) {
        flex-direction: column;
    }
`;

const Label = styled.div`
    display: flex;
    padding-right: 20px;
    padding-top: 4px;
    padding-bottom: 10px;

    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    text-transform: capitalize;
    font-size: ${variables.FONT_SIZE.NORMAL};
    color: ${props => props.theme.TYPE_DARK_GREY};
`;

// wrapper for shareable Fees component
const ExchangeFees = () => {
    const {
        errors,
        register,
        setValue,
        getValues,
        account,
        changeFeeLevel,
        feeInfo,
        transactionInfo,
    } = useCoinmarketExchangeFormContext();

    // workaround
    // exchange hook does not provide whole PrecomposedLevels object
    // build it from transactionInfo
    let composedLevels: PrecomposedLevels | undefined;
    if (transactionInfo) {
        const selectedFee = getValues('selectedFee');
        composedLevels = {};
        composedLevels[selectedFee] = transactionInfo;
    }

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

export default ExchangeFees;
