geth --networkid 4224 --mine --miner.threads 2 --datadir "." --nodiscover --ws --ws.addr 127.0.0.1 --ws.port 8080 --ws.origins "*" --nat "any" --ws.api eth,net,rpc,web3,shh --shh --unlock 0 --password "./password.sec" --allow-insecure-unlock --ipcpath "~/.ethereum/geth.ipc"

# https://www.youtube.com/watch?v=A5V2jdLi5mI

# web3.fromWei(eth.getBalance(eth.accounts[0]), "ether")
# eth.sendTransaction({ from: eth.accounts[0], to: eth.accounts[1], value: web3.toWei(1000, "ether") })