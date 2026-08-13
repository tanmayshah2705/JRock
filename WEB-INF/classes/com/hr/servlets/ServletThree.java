package com.hr.servlets;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import com.hr.dl.*;
import java.util.*;
import java.io.*;
import com.google.gson.*;

public class ServletThree extends HttpServlet
{
public void doGet(HttpServletRequest request, HttpServletResponse response)
{
try
{
response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
}catch(Exception e)
{
}
}

public void doPost(HttpServletRequest request,HttpServletResponse response)
{
try
{

BufferedReader br = request.getReader();
StringBuffer sb = new StringBuffer("");
String d=null;
while(true)
{
d=br.readLine();
if(d==null) break;
sb.append(d);
}
String rawString = sb.toString();
Gson gson = new Gson();
JsonObject obj = gson.fromJson(rawString,JsonObject.class);

String jsonString = gson.toJson(obj);
response.setContentType("application/json");
PrintWriter pw = response.getWriter();
pw.print(jsonString);
pw.flush();
}catch(Exception e)
{
try{
response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);}catch(Exception xe){}
}
}

}