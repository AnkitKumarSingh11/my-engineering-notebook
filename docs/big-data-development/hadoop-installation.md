# Hadoop Installation on Ubuntu
Install prerequisite software's:

```
sudo apt-get update
sudo apt-get install -y openssh-client openssh-server vim ssh -y
sudo apt install openjdk-8-jdk openjdk-8-jre
```

Open .bashrc file

```
code ~/.bashrc OR sudo nano ~/.bashrc
```

and add below 2 lines (as shown in Image, save and close):

![](https://miro.medium.com/v2/resize:fit:700/1*qan8SBdJ1gXCf3_zse_uQA.png)

```
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export JRE_HOME=/usr/lib/jvm/java-8-openjdk-amd64/jre
```

If permission to save denied then close without save and run below code and repeat above steps:

```
sudo chown -R hadoop ~/.bashrc
```

Download hadoop.3.2.1.tar.gz, unzip and move to /usr/local, add permissions ->

```
wget https://archive.apache.org/dist/hadoop/common/hadoop-3.2.1/hadoop-3.2.1.tar.gz
tar -xzf hadoop-3.2.1.tar.gz
sudo mv hadoop-3.2.1 hadoop
sudo mv hadoop /usr/local
sudo chmod 777 /usr/local/hadoop

```

Open the file

```
code ~/.bashrc OR sudo nano ~/.bashrc
```

and add following lines in end of file (Save and close):

```
export HADOOP_HOME=/usr/local/hadoop
export HADOOP_INSTALL=$HADOOP_HOME
export HADOOP_MAPRED_HOME=$HADOOP_HOME
export HADOOP_COMMON_HOME=$HADOOP_HOME
export HADOOP_HDFS_HOME=$HADOOP_HOME
export HADOOP_YARN_HOME=$HADOOP_HOME
export YARN_HOME=$HADOOP_HOME
export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin
```

Reload the changes done above, create some directories for HDFS namenode. datanode, logs:

```
source ~/.bashrc
mkdir -p $HADOOP_HOME/hdfs/namenode
mkdir -p $HADOOP_HOME/hdfs/datanode
mkdir $HADOOP_HOME/logs
```

To edit series HFDS configuration files, change directory to the folder and open hadoop-env.sh:

```
cd $HADOOP_HOME/etc/hadoop
code hadoop-env.sh OR sudo nano hadoop-env.sh
```

Add this line in end of file (save and close):

```
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
```

Edit core-site.xml:

```
code core-site.xml OR sudo nano core-site.xml
```

Edit configuration to make it look like this (save and close):

```
<configuration>
 <property>
 <name>fs.defaultFS</name>
 <value>hdfs://localhost:9000/</value>
 </property>
</configuration>
```

Edit hdfs-site.xml:

```
code hdfs-site.xml OR sudo nano hdfs-site.xml
```

Edit configuration to make it look like this (Save and Close):

```
<configuration>
 <property>
 <name>dfs.namenode.name.dir</name>
 <value>file:///usr/local/hadoop/hdfs/namenode</value>
 <description>NameNode directory for namespace and transaction logs storage.</description>
 </property>
 <property>
 <name>dfs.datanode.data.dir</name>
 <value>file:///usr/local/hadoop/hdfs/datanode</value>
 <description>DataNode directory</description>
 </property>
 <property>
 <name>dfs.replication</name>
 <value>2</value>
 </property>
</configuration>
```

Edit mapred-site.xml:

```
code mapred-site.xml OR sudo nano mapred-site.xml
```

Edit configuration to make it look like this(Save and close):

```
<configuration>
 <property>
 <name>mapreduce.framework.name</name>
 <value>yarn</value>
 </property>
 <property>
 <name>yarn.app.mapreduce.am.env</name>
 <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
 </property>
 <property>
 <name>mapreduce.map.env</name>
 <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
 </property>
 <property>
 <name>mapreduce.reduce.env</name>
 <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
 </property>
</configuration>
```

Edit yarn-site.xml:

```
code yarn-site.xml OR sudo nano yarn-site.xml
```

Edit configuration to make it look like this(Save and Close):

```
<configuration>
 <property>
 <name>yarn.nodemanager.aux-services</name>
 <value>mapreduce_shuffle</value>
 </property>
 <property>
 <name>yarn.nodemanager.aux-services.mapreduce_shuffle.class</name>
 <value>org.apache.hadoop.mapred.ShuffleHandler</value>
 </property>
 <property>
 <name>yarn.resourcemanager.hostname</name>
 <value>localhost</value>
 </property>
</configuration>
```

Generate ssh key and add to authorized keys in Ubuntu:

```
cd ~
ssh-keygen
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Open these 2 files

```
code /etc/ssh/ssh_config OR sudo nano /etc/ssh/ssh_configcode /etc/ssh/sshd_config 
OR 
sudo nano /etc/ssh/sshd_config
```

and add in last line (save and close):

```
Port 2222
```

Open this file:

```
code ~/.ssh/config OR sudo nano ~/.ssh/config
```

and add below lines (save and close)

```
Host *
 StrictHostKeyChecking no
```

Prepare Namenode for HDFS and restart ssh service:

```
hdfs namenode -format
sudo /etc/init.d/ssh restart
```

Finally Start hadoop by below command:

```
start-all.sh
```

Check whether all running or not:

```
jps
```

![](https://miro.medium.com/v2/resize:fit:212/1*RYSAqUWc5_f65BkgCJKfhg.png)

Type this command to check whether hdfs is working properly:

```
hdfs dfs -mkdir /temp
hdfs dfs -ls /
```

See that above command lists the new directory temp created under HDFS

On Restart of system, if you cant seem to run hdfs commands in Ubuntu, then try this lines:

```
sudo service ssh restart
start-all.sh
```

After this just visit: [`http://localhost:9870`](http://localhost:9870) to view the hadoop cluster on web

HDFS and Hadoop Status: `http://localhost:9870` 

Hadoop Map Reduce Job Logs: [`http://localhost:8088`](http://localhost:8088)
