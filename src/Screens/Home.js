import { Card, CardContent, Typography } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import React from "react";

export default function Home() {
  return (
    <div>
      <Card elevation={1}>
        {/* <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              {note.category[0].toUpperCase()}
            </Avatar>
          }
          action={
            <IconButton onClick={() => handleDelete(note.id)}>
              <DeleteOutlined />
            </IconButton>
          }
          title={note.title}
          subheader={note.category}
        /> */}
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {/* {note.details} */}
            <AddCircleOutline />
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
