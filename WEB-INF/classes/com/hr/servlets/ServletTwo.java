package com.hr.servlets;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import com.hr.dl.*;
import java.util.*;
import java.io.*;

public class ServletTwo extends HttpServlet
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
response.setContentType("text/plain");
int code = Integer.parseInt(request.getParameter("code"));
try
{
DesignationDTO designation= new DesignationDAO().getByCode(code);
pw.print(designation.getCode()+","+designation.getTitle());
}catch(DAOException daoException)
{
pw.print("INVALID");
}

}catch(Exception e)
{
try{
response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);}catch(Exception xe){}
}
}

}