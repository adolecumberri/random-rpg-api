
create database users_books;
use users_books;
create table `users` (
	id int not null auto_increment,
    name varchar(45),
    primary key (id),
    UNIQUE KEY `name` (`name`)
);

create table `categories` (
	id int not null auto_increment,
    name varchar (15),
    UNIQUE KEY `name` (`name`),
    primary key (id)
);

create table `books` (
	id int not null auto_increment,
    name varchar(15),
    primary key (id),
    UNIQUE KEY `name` (`name`)	
);

create table `users_books` (
	id_user int,
    id_book int ,
    PRIMARY KEY (id_user, id_book),
    CONSTRAINT FOREIGN KEY (`id_user`) REFERENCES `users` (`id`)  ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (`id_book`) REFERENCES `books` (`id`)  ON DELETE CASCADE
);

create table `books_categories` (
    id_book int ,
    id_category int,
    PRIMARY KEY (id_category, id_book),
    CONSTRAINT FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`)  ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (`id_book`) REFERENCES `books` (`id`)  ON DELETE CASCADE
);



