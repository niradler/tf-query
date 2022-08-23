# tf-query

query hcl files

## Usage

```sh
npm i -g tf-query
```

```sh
tf-query -b variable -n instance_type
tf-query -q variable.network_interface_id[0].default -o newline
tf-query -b resource -t aws_instance -n test
```
