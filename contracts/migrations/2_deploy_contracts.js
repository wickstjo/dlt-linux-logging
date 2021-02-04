module.exports = (deployer) => {
    deployer.deploy(
        artifacts.require('./contracts/DeviceManager.sol')
    )
}