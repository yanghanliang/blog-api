#！/bin/sh

checkfilesize()

{

       time=$(date "+%Y-%m-%d %H:%M:%S")   #获取当前系统时间

        filename=C:/webs/blog_v1.1/blog-api/backupsSqlData

        if [ ! -f "$filename" ]                                     #没有文件则创建文件

        then

              touch ../backupsSqlData

          fi

         filezise=' ls -l $filename | awk '{ print $5}' '          #获取文件本身大小

          maxsize=$((102))                                        #最大内存10k

          if [ $filesize -gt $maxsize ]                                   #判断文件是否大于某个内存大小，

          then

                  rm -rf $filename    #把之前的备份一份后，再删除

           fi

          

}

checkfilesize
