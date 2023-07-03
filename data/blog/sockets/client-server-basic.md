---
title: Writing your first Client-Server Program Quickly!
date: '2022-01-03'
tags: ['socket-programming', 'c-language']
draft: false
summary: "Your College Professor asked you to prepare a basic client-server program for the networks lab next week or maybe you are yourself starting Socket programming, what's better than writing the first program and learning along that"
authors: ['default']
canonicalUrl: https://dev.to/iabdsam/writing-your-first-client-server-program-5a0b
---

The **canonical post** is on dev.to at https://dev.to/iabdsam/writing-your-first-client-server-program-5a0b

Your College Professor asked you to prepare a basic client-server program for the networks lab next week or maybe you are yourself starting Socket programming, what's better than writing the first program and learning along that.

## What is a socket?

well, its (an integer and) a file descriptor through which we do our desired communication.

## What does communication looks like?

Server - `bind()`s socket to an address and port, this socket then `listen()`s for incoming, then `accept()`s the incoming request (from client).

Client - `connect()`s your socket via local address and port for a `listen()`ing socket to `accept()`.

## What happens after connect() and accept()?

`accept()` returns a new socket to be used for communicating to that particular accepted client.
In client side, the same socket used to connect is used to communicate.

Now you can `send()` and `recv()` from both sides.

# How

What is the first thing that you need? Headers!

We will be using the following

```cpp
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <arpa/inet.h>
```

Lets build both sides one-by-one

<hr></hr>

### server.c

```cpp
int main() {
    int sockID1 = socket(PF_INET, SOCK_STREAM, 0);
```

A stream socket has been created in PF_INET(internet) domain.

Now, we have to bind our socket to an address and port. But, the bind() function asks for one struct (of sockaddr type) that has all that info. Instead we pass it sockaddr_in casted to sockaddr because it is more specific to our needs.

```cpp
struct sockaddr_in addrPort1;
addrPort1.sin_family = AF_INET; // sets IPv4
addrPort1.sin_addr.s_addr = htonl(INADDR_ANY);
addrPort1.sin_port = htons(5200);
//htonl - host to network long, htons - host to network short
```

We filled the structure. Here, INADDR_ANY automatically fills a default Ip address since we don't want to bind it to particular one.

5200 is the port number that we will be using. You can use your own (make sure it is not reserved) (use the same in client).

```cpp
if(bind(sockID1, (struct sockaddr *) &addrPort1, sizeof(addrPort1))==-1) {
    printf("\nBind Failed to Port 5200\n\n");
}
else printf("\nBind Success to Port 5200\n\n");
```

Binded the socket, returns -1 if fails.

```cpp
if(listen(sockID1, 10)) {
    printf("Listen Failed\n\n");
}
else printf("Listening...\n\n");
```

Now we are ready to accept an incoming request (connect() from client).

```cpp
struct sockaddr_in client_addr;
socklen_t len = sizeof(client_addr);

int sockID2 = accept(sockID1, (struct sockaddr *) &client_addr, &len);
printf("Accepted a connection\n");
```

This is interesting. The only thing accept() needs from our server is sockID1. client_addr will contain info about the client it accepts and will be filled on function call.

This returns a new socket (sockID2) for us which will be used for sending and recieving from the client.

The last step.

```cpp
char msg[50];
int countR, countS;

while(strcmp(msg,"Close\n")) {
    printf("To Client : ");
    fgets(msg, 50, stdin);
    countS = send(sockID2, msg, 50, 0);
    if(!strcmp(msg,"Close\n")) {
        break;
    }
    printf("From Client : ");
    countR = recv(sockID2, msg, 50, 0);
    printf("%s", msg);
}
```

Try to understand this yourself. countR and countS are there for error handling (send and recv give -1 on error). Sending or recieving the word "Close" is the exit condition.

What are we trying to do? First message to be sent by server. Client then recieves it and sends something. Server then recieves it and sends ...........

Finally

```cpp
close(sockID1);
    close(sockID2);

    printf("\nSocket connection Closed\n");

    return 0;
}
```

Without scratching heads, lets move to client.c

<hr />

### client.c

After the headers

```cpp
int main() {
    int sockID1 = socket(PF_INET, SOCK_STREAM, 0);

    struct sockaddr_in addrPort1;
    addrPort1.sin_family = AF_INET; //sets to IPv4
    addrPort1.sin_addr.s_addr = htonl(INADDR_ANY);
    addrPort1.sin_port = htons(5200);
    //htonl - host to network long, htons - host to network short
```

This is same, because connection also requires the specifics of where and via-what to connect.

```cpp
if(connect(sockID1, (struct sockaddr *) &addrPort1, sizeof(addrPort1))) {
    printf("\nConnect Failed\n\n");
}
else printf("\nConnected via Port 5200\n\n");
```

Nearly identical to bind(). Right. But remember, it complements the accept() function in the server side.

```cpp
char msg[50];
int countR, countS;

while(strcmp(msg,"Close\n")) {
    printf("From Server : ");
    countR = recv(sockID1, msg, 50, 0);
    printf("%s", msg);
    if(!strcmp(msg,"Close\n")) {
        break;
    }
    printf("To Server : ");
    fgets(msg, 50, stdin);
    countS = send(sockID1, msg, 50, 0);
}
```

I hope its easier to see the logic now.

```cpp
close(sockID1);
    printf("\nSocket connection Closed\n");

    return 0;
}
```

**Done.**

Move to the directory. Split your terminal. In one, run the server, then on other run the client. Happy connection !

I have tried to keep it as short as possible and only explain the things relevant to a first program.
Questions & Suggestions are welcome.
