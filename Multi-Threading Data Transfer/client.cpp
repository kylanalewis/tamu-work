#include "common.h"
#include "BoundedBuffer.h"
#include "Histogram.h"
#include "common.h"
#include <ctype.h>
#include <cstring>
#include <string>
#include <stdio.h>
#include <cstdio>
#include <stdlib.h>
#include <unistd.h> 
#include "HistogramCollection.h"
#include "FIFOreqchannel.h"
#include <mutex>
using namespace std;


void* file_function(char* charfile, __int64_t file_sz, BoundedBuffer *buffer)
{
 cout<< "Enter file function: "<< charfile<< endl;
    const int sz = sizeof(filemsg) + strlen(charfile) + 1;
    int offset = 0;
    while (offset < file_sz ){
        cout << "hit me." << endl;
        filemsg fm(offset, MAX_MESSAGE);
        char* buf = new char[sizeof(filemsg)];
        memcpy(buf, &fm, sizeof(filemsg));
        memcpy(buf + sizeof(filemsg), charfile, strlen(charfile) + 1);

        vector<char> v(buf, buf + sz);
        buffer->push(v);
        offset+=MAX_MESSAGE;
        if(file_sz - offset <= MAX_MESSAGE ){
            int final = file_sz - offset;
            filemsg fm(final, MAX_MESSAGE);
            char* buf = new char[sizeof(filemsg)];
            memcpy(buf, &fm, sizeof(filemsg));
            memcpy(buf + sizeof(filemsg), charfile, strlen(charfile) + 1);
            vector<char> v(buf, buf + sz);
            buffer->push(v);
            cout << "again." << endl;
            offset+=MAX_MESSAGE;
        }
    }
    
}


void* patient_function( int patient, int n, BoundedBuffer *buf)
{
    cout<< "Enter patient function: "<< endl;
    for(int i = 0; i < n; i++){
        datamsg* msg = new datamsg(patient, (0.004*i), 1);
        char* num = (char*)msg;
        vector<char>vec(num, (num +sizeof(datamsg)));
        vector<char> buff((char*)&msg, (char*)&msg + sizeof(msg));
        buf->push(buff);
    }
    
}
    

void* worker_function(BoundedBuffer* buffer, FIFORequestChannel* chan, HistogramCollection* hc, char* charfile)
{   
    cout<< "Enter worker function: "<< endl;
    string findc(charfile);
    bool csv = false;
    string s1 = ".csv";
    size_t found = findc.find(s1); 
    if (found != string::npos) {
      csv = true;
      
    }
    FILE * wf;
    wf = fopen(charfile, "wb+");


    while(true) {
        vector<char> req_v = buffer->pop();
        char* msg_type = reinterpret_cast<char*>(req_v.data());
        char* req_c = req_v.data();
        MESSAGE_TYPE m = *(MESSAGE_TYPE*) req_c;

        if(*(MESSAGE_TYPE*)msg_type == DATA_MSG) {
            chan->cwrite(req_c, sizeof(datamsg));
            char* value = chan->cread();
            datamsg dm = *(datamsg*)req_c;
            hc->update(dm.person, (*(double*)value));   

        }        
        else if(*(MESSAGE_TYPE*)msg_type == FILE_MSG) {

            if(csv == true){
            filemsg* f = (filemsg*) req_c;
            const int sz = sizeof(filemsg) + strlen(charfile) + 1;
            chan->cwrite(req_c, sz);
            char* file_data = chan->cread();            
            fseek(wf, f->offset, SEEK_SET);
            fwrite(file_data, sizeof(char), strlen(file_data), wf);

            }else
            {
            filemsg* f = (filemsg*) req_c;
            const int sz = sizeof(filemsg) + strlen(charfile) + 1;
            chan->cwrite(req_c, sz);
            char* file_data = chan->cread();            
            fseek(wf, f->offset, SEEK_SET);
            fwrite(file_data, sizeof(char), MAX_MESSAGE, wf);    
            }
            
        }
        else if(*(MESSAGE_TYPE*)msg_type == QUIT_MSG) {
            chan->cwrite((char*)&m, sizeof(MESSAGE_TYPE));
            delete chan;
            break;
        }
    }
   fclose(wf);
}


int main(int argc, char *argv[])
{
    int n = 15000;    //default number of requests per "patient"
    int p = 2;     // number of patients [1,15] 10
    int w = 500;    //default number of worker threads 500
    int b = 50; 	// default capacity of the request buffer, you should change this default
	int m = MAX_MESSAGE; 	// default capacity of the file buffer
    char* f = NULL;
    bool flagger = false;
    extern char *optarg;
    extern int optind, optopt;
   
    int opt;
    cout<<"Debugger"<<endl;
 while ((opt = getopt(argc, argv, ":n:p:w:b:f:")) != -1)
  switch (opt)
  {
    case 'n':
    n = atoi(optarg);
    printf("option: %s\n", optarg); 
    break;

    case 'p':
    p = atoi(optarg);
    printf("option: %s\n", optarg); 
    break;

    case 'w':
    w = atoi(optarg);
    printf("option: %s\n", optarg); 
    break;

    case 'b':
    b = atoi(optarg);
    printf("option: %s\n", optarg); 
    break;

    case 'f':
    f = optarg;
    flagger = true;
    cout<<"F: "<< flagger<<endl;
    printf("option: %s\n", optarg);    
    break;   

  return 1;
  default:
  abort ();
  }

    
    srand(time_t(NULL));
    
    int pid = fork();
    if (pid == 0){
		// modify this to pass along m
    execl ("dataserver", "dataserver", (char *)NULL);

    cout << "value n: "<< n << endl;
    cout << "value p: "<< p << endl;
    cout << "value w: "<< w << endl;
    cout << "value b: "<< b << endl;


    
	FIFORequestChannel* chan = new FIFORequestChannel("control", FIFORequestChannel::CLIENT_SIDE);
    BoundedBuffer request_buffer(b);
	HistogramCollection hc;
	
    struct timeval start, end;
    gettimeofday (&start, 0);

/* FILE TRANSFER SECTION */
    cout<<"taken "<<endl;
if(flagger){
    cout<<" Doing file stuff... "<<endl;
    filemsg size_fm(0, 0);
    const int sz = sizeof(filemsg) + strlen(f) + 1;
    char* buff = new char[sz];
    memcpy(buff, &size_fm, sizeof(filemsg));
    memcpy(buff + sizeof(filemsg), f, strlen(f) + 1);
    vector<thread> wrk_t;
    vector<thread> patients;
    vector<Histogram*> histograms;
    vector<FIFORequestChannel*> channels;
   

    int w = chan->cwrite(buff, sz);
    __int64_t file_sz = *(__int64_t*) chan->cread();



    thread fq_thread(file_function, f, file_sz, &request_buffer);

    MESSAGE_TYPE nc_msg = NEWCHANNEL_MSG;
    for (int i = 0 ; i < w ; i++) {
        char* nc_buf = new char [sizeof(nc_msg)];
        memcpy(nc_buf, &nc_msg, sizeof(nc_msg));
        chan->cwrite(nc_buf, sizeof(nc_msg));

        string chan_name = chan->cread();
        FIFORequestChannel *c = new FIFORequestChannel(chan_name, FIFORequestChannel::CLIENT_SIDE);
        channels.push_back(c);
    }

    for(int i = 0; i < w; i++) {
        wrk_t.push_back(move(thread(worker_function, &request_buffer, channels[i], &hc, f)));
    }

    fq_thread.join();

    MESSAGE_TYPE q_msg = QUIT_MSG;
    for (int i = 0; i < w; i++) {
        char* qBuf = new char[sizeof(q_msg)];
        memcpy(qBuf, &q_msg, sizeof(q_msg));

        vector<char> v(qBuf, qBuf+sizeof(q_msg));
        request_buffer.push(v);
    } 

    for (int i = 0; i < w; i++) {
        wrk_t[i].join();
    }
    }else{
    cout<<" Doing regular data stuff... "<<endl;
    vector<thread> patients;
    vector<thread> wrk_t;
    vector<FIFORequestChannel*> channels;
    vector<Histogram*> histograms;
    //thread* patients = new thread[p];
    thread* workers = new thread[w];
    double num_bins = sqrt(((double) n));

    for (int i = 0; i < p; i++) {
        patients[i-1] = thread(patient_function, i, n, &request_buffer);
        Histogram* h = new Histogram(10, -2, 2);
        histograms.push_back(h);
        hc.add(h); 
    }
    for (int i = 1; i <= p; i++) {
        patients.push_back(move(thread(patient_function, i, n, &request_buffer)));
    }    
    // MESSAGE_TYPE nc_msg = NEWCHANNEL_MSG;
    for (int i = 0 ; i < w ; i++) {
        
        chan->cwrite((char *)NEWCHANNEL_MSG, sizeof (NEWCHANNEL_MSG));
        char* buf = chan->cread();
        string name = buf;
        FIFORequestChannel* w_chan = new FIFORequestChannel(name, FIFORequestChannel::CLIENT_SIDE);
        wrk_t.push_back(move(thread(worker_function, &request_buffer, w_chan, &hc, f)));
        workers[i] = thread(worker_function, &request_buffer, w_chan, &hc, f);
        delete[] buf;

        // char* nc_buf = new char [sizeof(MESSAGE_TYPE)];
        // memcpy(nc_buf, NEWCHANNEL_MSG, sizeof(MESSAGE_TYPE));
        // chan->cwrite(nc_buf, sizeof(MESSAGE_TYPE));

        // string chan_name = chan->cread();
        // FIFORequestChannel *c = new FIFORequestChannel(chan_name, FIFORequestChannel::CLIENT_SIDE);
        // channels.push_back(c);
    }

    for (int i = 0; i < p; i++) {
        patients[i].join();
    }
    for (int i = 0; i < w; i++) {
        wrk_t[i].join();
    }

    MESSAGE_TYPE q_msg = QUIT_MSG;
    for (int i = 0; i < w; i++) {
        char* qBuf = new char[sizeof(MESSAGE_TYPE)];
        memcpy(qBuf, &q_msg, sizeof(MESSAGE_TYPE));

        vector<char> v(qBuf, qBuf+sizeof(MESSAGE_TYPE));
        request_buffer.push(v);
    } 
    hc.print ();
    gettimeofday (&end, 0);

    }
     
    
    int secs = (end.tv_sec * 1e6 + end.tv_usec - start.tv_sec * 1e6 - start.tv_usec)/(int) 1e6;
    int usecs = (int)(end.tv_sec * 1e6 + end.tv_usec - start.tv_sec * 1e6 - start.tv_usec)%((int) 1e6);
    cout << "Took " << secs << " seconds and " << usecs << " micro seconds" << endl;

    MESSAGE_TYPE q = QUIT_MSG;
    chan->cwrite ((char *) &q, sizeof (MESSAGE_TYPE));
    cout << "All Done!!!" << endl;
    delete chan;
    
}
}