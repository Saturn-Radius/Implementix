# Implement-ix
React+Redux structured SPA with powerful supporting of TrackviaAPI.


## Environment Configuration
Set environment keys

### Local(MacOSX)
1. Open bash_profile
```
touch ~/.bash_profile
open ~/.bash_profile
```

2. Define following envs.
```
export CONFIG_API_BASE=http://localhost:3000/
export CONFIG_API_BASE_HTTPS=https://localhost:3443/
export CONFIG_ASSET_URL=http://localhost:3000/
export CONFIG_ASSET_URL_HTTPS=https://localhost:3443/
export CONFIG_PORT_NUM=3000
export CONFIG_PORT_NUM_HTTPS=3443
export CONFIG_IS_SANDBOX=true
```

3. Set envs
```
source ~/.bash_profile
```

### AWS(Ubuntu 16.04)
1. Open profile
```
```

AWS:
```
export CONFIG_API_BASE=http://ec2-34-215-162-67.us-west-2.compute.amazonaws.com/
export CONFIG_API_BASE_HTTPS=https://ec2-34-215-162-67.us-west-2.compute.amazonaws.com/
export CONFIG_ASSET_URL=http://ec2-34-215-162-67.us-west-2.compute.amazonaws.com/
export CONFIG_ASSET_URL_HTTPS=https://ec2-34-215-162-67.us-west-2.compute.amazonaws.com/
export CONFIG_PORT_NUM=80
export CONFIG_PORT_NUM_HTTPS=443
export CONFIG_IS_SANDBOX=false
```

### Install

##### Install dependencies

```
npm install
```

##### Build application

```
gulp publish
```

For development purpose, we can use 

```
gulp watch
```

