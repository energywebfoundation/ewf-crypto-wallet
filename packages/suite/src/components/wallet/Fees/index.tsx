import React from 'react';
import styled from 'styled-components';
import { UseFormMethods } from 'react-hook-form';
import { FeeLevel } from 'trezor-connect';
import { SelectBar, variables } from '@trezor/components';
import { FiatValue, FormattedCryptoAmount } from '@suite-components';
import { formatNetworkAmount } from '@wallet-utils/accountUtils';
import { InputError } from '@wallet-components';
import FeeCustom from './components/FeeCustom';
import FeeDetails from './components/FeeDetails';
import { Account } from '@wallet-types';
import { FeeInfo, PrecomposedLevels } from '@wallet-types/sendForm';
import { TypedValidationRules } from '@wallet-types/form';

const FeeSetupWrapper = styled.div``;

const SelectBarWrapper = styled.div`
    display: flex; /* necessary for the <SelectBar> not to be stretched over full column width */
    margin: 0 20px 20px 0;
`;

const CoinAmount = styled.div`
    display: flex;
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    font-size: ${variables.FONT_SIZE.NORMAL};
    color: ${props => props.theme.TYPE_DARK_GREY};
    padding-bottom: 6px;
`;

const FiatAmount = styled.div`
    display: flex;
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    font-size: ${variables.FONT_SIZE.NORMAL};
    color: ${props => props.theme.TYPE_LIGHT_GREY};
`;

const FeesWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const FeeAmount = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    padding-top: 5px;
`;

const FeeError = styled(FeeAmount)`
    font-size: ${variables.FONT_SIZE.TINY};
    color: ${props => props.theme.TYPE_RED};
`;

const FeeInfoWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    min-height: 32px; /* prevent jumps when switching from/to custom fee  */
`;

const buildFeeOptions = (levels: FeeLevel[]) =>
    levels.map(({ label }) => ({
        label,
        value: label,
    }));

// Shared subset of 'react-hook-form' FormState
type FormState = UseFormMethods<{
    selectedFee?: FeeLevel['label'];
    feePerUnit?: string;
    feeLimit?: string;
    estimatedFeeLimit?: string;
}>;

export interface Props {
    account: Account;
    feeInfo: FeeInfo;
    register: (rules?: TypedValidationRules) => (ref: any) => void;
    setValue: FormState['setValue'];
    getValues: FormState['getValues'];
    errors: FormState['errors'];
    changeFeeLevel: (level: FeeLevel['label']) => void;
    changeFeePerUnit?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    changeFeeLimit?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    composedLevels?: PrecomposedLevels;
}

const Fees = (props: Props) => {
    const {
        account: { symbol, networkType },
        feeInfo,
        getValues,
        errors,
        changeFeeLevel,
        composedLevels,
    } = props;

    const selectedOption = getValues('selectedFee') || 'normal';
    const error = errors.selectedFee;
    const selectedLevel = feeInfo.levels.find(level => level.label === selectedOption)!;
    const transactionInfo = composedLevels ? composedLevels[selectedOption] : undefined;
    const isCustomLevel = selectedOption === 'custom';
    const feeOptions = buildFeeOptions(feeInfo.levels);

    return (
        <FeesWrapper>
            <FeeSetupWrapper>
                <SelectBarWrapper>
                    <SelectBar
                        selectedOption={selectedOption}
                        options={feeOptions}
                        onChange={changeFeeLevel}
                    />
                </SelectBarWrapper>

                <FeeInfoWrapper>
                    {isCustomLevel ? (
                        <FeeCustom {...props} />
                    ) : (
                        <FeeDetails
                            networkType={networkType}
                            feeInfo={feeInfo}
                            selectedLevel={selectedLevel}
                            transactionInfo={transactionInfo}
                        />
                    )}
                </FeeInfoWrapper>
            </FeeSetupWrapper>
            {transactionInfo !== undefined && transactionInfo.type !== 'error' && (
                <FeeAmount>
                    <CoinAmount>
                        <FormattedCryptoAmount
                            disableHiddenPlaceholder
                            value={formatNetworkAmount(transactionInfo.fee, symbol)}
                            symbol={symbol}
                        />
                    </CoinAmount>
                    <FiatAmount>
                        <FiatValue
                            disableHiddenPlaceholder
                            amount={formatNetworkAmount(transactionInfo.fee, symbol)}
                            symbol={symbol}
                        />
                    </FiatAmount>
                </FeeAmount>
            )}
            {error && (
                <FeeError>
                    <InputError error={error} />
                </FeeError>
            )}
        </FeesWrapper>
    );
};

export default Fees;
