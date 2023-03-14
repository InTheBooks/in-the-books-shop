import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllAuthors, createAuthor } from "../api/api";

const AuthorForm = (props) => {
  const [authorList, setAuthorList] = useState([]);
  const [newAuthor, setNewAuthor] = useState({});
  //dropdown state
  const [authorId, setAuthorId] = useState("");
  const [edit, setEdit] = useState(false);
  //form state
  const [authorFirstName, setAuthorFirstName] = useState("");
  const [authorLastName, setAuthorLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [authorImage, setAuthorImage] = useState("");
  const [authorBio, setAuthorBio] = useState("");

  function refreshAuthors() {
    fetchAllAuthors().then((authors) => {
      setAuthorList(authors);
      console.log("author useEffect 1");
    });
  }

  useEffect(() => {
    refreshAuthors();
  }, []);

  useEffect(() => {
    if (props.book === null) {
      return;
    } else {
      setAuthorId(props.book.authorId);
      console.log("author useEffect 2");
    }
  }, [props.book]);

  return (
    <div>
      {!edit ? (
        <div>
          <fieldset>
            <label> Select Author: </label>
            <select
              value={authorId}
              defaultValue={props.book ? props.book.authorId : "--"}
              onChange={(e) => {
                e.preventDefault();
                const newAuthorId = e.target.value
                setAuthorId(
                  newAuthorId === "New Author"
                    ? setEdit(true)
                    : newAuthorId
                );
                  props.bookToSend.authorId = newAuthorId;
                  console.log(props.bookToSend.authorId)
              }}
            >
              <option value={"--"} label="--"></option>
              <option value={"New Author"} label="New Author"></option>
              {authorList.map((author) => {
                return (
                  <option
                    value={author.id}
                    key={author.id}
                    label={
                      author.authorLastName +
                      ", " +
                      author.authorFirstName +
                      " | Date of Birth: " +
                      author.dateOfBirth +
                      " | Birth Place: " +
                      author.birthPlace
                    }
                  ></option>
                );
              })}
            </select>
          </fieldset>
        </div>
      ) : (
        <form>
          <h3>Add New Author</h3>
          <div>
            Author First Name
            <input
            required
              value={authorFirstName}
              onChange={(e) => {
                e.preventDefault();
                const firstName = e.target.value;
                setAuthorFirstName(firstName);
                newAuthor.authorFirstName = firstName;
              }}
            ></input>
          </div>
          <div>
            Author Last Name
            <input
            required
              value={authorLastName}
              onChange={(e) => {
                e.preventDefault();
                const lastName = e.target.value;
                setAuthorLastName(lastName);
                newAuthor.authorLastName = lastName;
              }}
            ></input>
          </div>
          <div>
            Date Of Birth
            <input
            required
              value={dateOfBirth}
              onChange={(e) => {
                e.preventDefault();
                const DOB = e.target.value;
                setDateOfBirth(DOB);
                newAuthor.dateOfBirth = DOB;
              }}
            ></input>
          </div>
          <div>
            Birth Place
            <input
            required
              value={birthPlace}
              onChange={(e) => {
                e.preventDefault();
                const birthPlace = e.target.value;
                setBirthPlace(birthPlace);
                newAuthor.birthPlace = birthPlace;
              }}
            ></input>
          </div>
          <div>
            Link to Portrait
            <input
              value={authorImage}
              onChange={(e) => {
                e.preventDefault();
                const link = e.target.value;
                setAuthorImage(link);
                newAuthor.authorImage = link;
              }}
            ></input>
          </div>
          <div>
            Bio
            <input
              value={authorBio}
              onChange={(e) => {
                e.preventDefault();
                const bio = e.target.value;
                setAuthorBio(bio);
                newAuthor.authorBio = bio;
              }}
            ></input>
            <br />
            <button
              onClick={async (e) => {
                e.preventDefault();
                console.log(newAuthor);
                const updatedAuthor = await createAuthor(newAuthor);
                console.log(updatedAuthor);
                if (updatedAuthor.error) {
                  alert(updatedAuthor.message);
                } else {
                  setEdit(false);
                  setAuthorFirstName("")
                  setAuthorLastName("")
                  setDateOfBirth("")
                  setAuthorImage("")
                  setAuthorBio("")
                  refreshAuthors();
                }
              }}
            >
              Add Author
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setEdit(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AuthorForm;
