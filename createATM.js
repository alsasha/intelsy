const banknotesTypes = [5000, 1000, 500, 100, 50]

const DURATIONS = {5000: 500, 1000: 400, 500: 300, 100: 200, 50: 100};

const calculateBanknotes = (remainingAmount, availableBanknotesInATM, resultBanknotes, banknoteType) => {
    const {withdrawalAmount} = remainingAmount
    const amountOfBanknoteType = availableBanknotesInATM[banknoteType]
    const isBanknoteFit = amountOfBanknoteType && amountOfBanknoteType > 0 && banknoteType <= withdrawalAmount
    if (!isBanknoteFit) {
        return withdrawalAmount
    }
    const result = Math.floor(withdrawalAmount / banknoteType)
    const banknoteAmount =  result > amountOfBanknoteType ? amountOfBanknoteType : result
    const newRemainingAmount = withdrawalAmount - banknoteType * banknoteAmount
    availableBanknotesInATM[banknoteType] = Math.floor(amountOfBanknoteType - banknoteAmount)
    resultBanknotes[banknoteType] = banknoteAmount
    remainingAmount.withdrawalAmount = newRemainingAmount
    return newRemainingAmount
}

const createATM = (initBanknotesInATM) => {
    const availableBanknotesInATM = {...initBanknotesInATM}
    let nextAmounts = []
    let isActive = false
    const getResult = (withdrawalAmount) => {
        if (isActive) {
            nextAmounts.push(withdrawalAmount)
            return
        }
        isActive = true
        const resultBanknotes = {}
        const remainingAmount = {withdrawalAmount}
        banknotesTypes.forEach((banknoteType) => calculateBanknotes(remainingAmount, availableBanknotesInATM, resultBanknotes, banknoteType))
        if (remainingAmount.withdrawalAmount > 0) {
            console.log('==========>', 'Недостаточно нужных банкнот')
            isActive = false
            if (nextAmounts.length) {
                const next = nextAmounts[0]
                nextAmounts = nextAmounts.slice(1)
                getResult(next)
            }
            return null
        }
        const sortedArray = Object.entries(resultBanknotes).sort(([a], [b]) => b - a).map(([type]) => type)
        let index = 0
        let secondsRemaining = resultBanknotes[sortedArray[index]]
        if (secondsRemaining) {
            let promise = new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (secondsRemaining === 0) {
                        if (index === sortedArray.length - 1) {
                            clearInterval(interval);
                            resolve(resultBanknotes)
                            return
                        } else {
                            index++
                            secondsRemaining = resultBanknotes[sortedArray[index]]
                        }
                    }
                    console.log('==========>', `Вывод ${sortedArray[index]} ${DURATIONS[sortedArray[index]]}мс`)
                    secondsRemaining--
                }, DURATIONS[sortedArray[index]]);
            })
            promise
                .then(
                    result => {
                        console.log('==========> Вывод', result)
                        isActive = false
                        if (nextAmounts.length) {
                            const next = nextAmounts[0]
                            nextAmounts = nextAmounts.slice(1)
                            getResult(next)
                        }
                    }
                );
        }
        return null
    }
    return getResult
}

const getMoney = createATM({5000: 0, 1000: 7, 100: 5});
getMoney(6200)
getMoney(1100)
getMoney(1200)
getMoney(1300)
