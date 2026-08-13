package com.hr.dl;
import java.sql.*;
public class AdministratorDAO
{
public AdministratorDAO()
{ 
}
public AdministratorDTO getByUsername(String username) throws DAOException
{
try
{
Connection connection = DAOConnection.getConnection();
PreparedStatement preparedStatement = connection.prepareStatement("select * from administrator where username = ?");
preparedStatement.setString(1,username);
ResultSet resultSet = preparedStatement.executeQuery();
if(resultSet.next()==false)
{
resultSet.close();
preparedStatement.close();
connection.close();
throw new DAOException("Username : "+username+" not found");
}
AdministratorDTO administratorDTO = new AdministratorDTO();
administratorDTO.setUsername(resultSet.getString("username"));
administratorDTO.setPassword(resultSet.getString("password").trim());
resultSet.close();
preparedStatement.close();
connection.close();
return administratorDTO;
}catch(SQLException sqle)
{
throw new DAOException(sqle.getMessage());
}
}

}