#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

int main()
{
	unsigned int result;
	int fd=open("dev/multiplier",O_RDWR);
	int i,j;
 unsigned int read_i;
 unsigned int read_j;
 int buffer[3];
	
	char input = 0;

	if(fd == -1){
		printf("Failed to open device file!\n");
		return -1;
	}

	while(input != 'q')
	{
		for(i=0; i<=16; i++)
		{
			for(j=0; j<=16; j++)
			{
      buffer[0]=i;
      buffer[1]=j;
      write(fd,(char*)&buffer,8);
      read(fd,(char*)buffer,12);
      read_i=buffer[0];
      read_j=buffer[1];
      result=buffer[2];
      
				printf("%u * %u = %u ",read_i,read_j,result);
		
				if(result==(i*j))
					printf("Result Correct!");		
				else
					printf("Result Incorrect!");

				input = getchar();		
			}

		}
	}
	close(fd);
	return 0;
}