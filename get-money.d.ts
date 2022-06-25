import banknotesTypes from './createATM'

interface RemainingAmount {
    withdrawalAmount: number;
}

type AvailableBanknotesInATM = {
    [K in typeof banknotesTypes[number]]: number
}

type ResultBanknotes = {
    [K in typeof banknotesTypes[number]]: number
}

type InitBanknotesInATM = {
    [K in typeof banknotesTypes[number]]: number
}

type BanknoteType = banknotesTypes[number]

type NextAmounts = number[]

type IsActive = boolean
