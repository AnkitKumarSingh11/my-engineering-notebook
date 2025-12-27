# Steps for installation of Apache HBase (Ubuntu)
### Step 1
Download HBase: To download HBase stable version, run the following command:
```bash
$ wget https://archive.apache.org/dist/hbase/stable/hbase-2.4.12-bin.tar.gz
```

### Step 2
To untar the HBase file run the following command:

```bash
$ tar xzvf https://archive.apache.org/dist/hbase/stable/hbase-2.4.12-bin.tar.gz
```

### Step 3
Navigate to hbase-2.4.12/bin:
```bash
$ cd hbase-2.4.12/bin
```

Set Java path: To set java path for HBase 
environment run the following command:
```bash
$ sudo nano conf/hbase-env.sh
```

And add the java path (below given) at the end of the and save it.
``bash
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
```

### Step 4
To start HBase: run the following commands:
```bash
$ cd hbase-2.4.12/bin
$ ./start-hbase.sh
```

Go to http://localhost:16010 to view the HBase web user interface.


### Step 5:
Connect to HBase shell: Connect to the instance of HBase use the hbase shell command, located in the bin directory.
```bash
$ ./hbase shell
```

### Step 6:
To create a table: Use the create command to create a new table. It is mandatory to specify the table name and the ColumnFamily name.

```bash
>create ‘MyDatabase’, ‘cf’
```

### Step 7:
Use the list command to check that the table exists or not.
```bash
>list ‘MyDatabase’
```

### Step 8:
Use the describe command to see details of the table
```bash
>describe ‘MyDatabase’
```

### Step 9:
To insert data into your table, use the put command:

>put ‘MyDatabase’, ‘row1’, ‘cf:a’, ‘10001’
>put ‘MyDatabase’, ‘row2’, ‘cf:b’, ‘Virendra’
>put ‘MyDatabase’, ‘row3’, ‘cf:c’, ‘200000’

### Step 10
Use the scan command to scan the table for data.

>scan ‘MyDatabase’

### Step 11
To get a single row of data at a time, use the get command.

>get ‘MyDatabase’, ‘row1’

### Step 12:
Disable a table — If you want to delete a table or change its settings, you need to disable the table first, so use the disable command for this purpose. You can re-enable the table using the enable command.
```bash
>disable ‘MyDatabase’
>enable ‘MyDatabase’
```

### Step 13:
Drop the table: To drop (delete) a table, use the drop command.
```bash
>drop ‘MyDatabase’
```

### Step 14
Exit from HBase Shell: To exit from the HBase Shell and disconnect from your cluster, use the quit command. However, HBase is still running in the background

### Step 15
Stop HBase: To stop all HBase daemons, you can run `./stop-hbase.sh` script.
```bash
$ ./stop-hbase.sh
```
