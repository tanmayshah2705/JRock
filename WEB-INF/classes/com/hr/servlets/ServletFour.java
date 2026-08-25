package com.hr.servlets;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import com.hr.dl.*;
import java.util.*;
import java.io.*;
import com.google.gson.*;

public class ServletFour extends HttpServlet
{
public void doPost(HttpServletRequest request, HttpServletResponse response)
{
try
{
response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
}catch(Exception e)
{
}
}

public void doGet(HttpServletRequest request,HttpServletResponse response)
{
try
{
PrintWriter pw = response.getWriter();
response.setContentType("application/json");
try
{
List<EmployeeDTO> employees= new EmployeeDAO().getAll();
pw.print(new Gson().toJson(employees));
pw.flush();
}catch(DAOException daoException)
{
System.out.println(daoException.getMessage());
try{
response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);}catch(Exception e){}
}
}catch(Exception e)
{}
}

}