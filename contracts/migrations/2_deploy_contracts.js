// MANAGER CONTRACTS
manager_contracts = [
    'Device',
    'Auth'
]

// DEPLOY
module.exports = deployer => {
    manager_contracts.forEach(contract => {
        deployer.deploy(
            artifacts.require('./contracts/' + contract + 'Manager.sol')
        )
    })
}