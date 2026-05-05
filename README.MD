# Laboration 4 - Autentisering | Backend-baserad webbutveckling 

Jag skapar i denna laboration en webbtjänst som kan skapa och hämta in data genom en databas. Syftet med API:et är att kunna skapa användarkonton, logga in, samt publicera nyhetsartiklar. 

För att skapa ett användarkonto krävs att besökaren anger:
-  **Användarnamn** - Unikt
- **Email** - Unikt
- **Lösenord** - Minimum längd 6 tecken.

För att logga in på ett användarkonto krävs att besökaren anger:
- **Email**
- **Lösenord**

För att skapa ett nyhetsinlägg krävs att besökaren anger:
- **Rubrik**
- **Innehåll** - Unikt
- **Skribent** - Minimum längd 3 tecken.

Lösenord hashas genom webbtjänsten inom databasservern med paketet - *Bcrypt*.  
Token skapas när en användare loggar in för att sedan kunna användas till att anropa skyddade routes och sidor. Exempelvis för att skapa och radera ett nyhetsinlägg, vilket kräver inloggning. För att generera token har *Json Web Token* paketet använts.

Funktionalitet för CRUD är implementerad genom CREATE, READ och DELETE.  
Felmeddelanden genereras i backend när användaren har gjort något fel eller när man försökt anropa en endpoint utan behörighet.

## Länk
En liveversion av API:et finns tillgänglig på följande URL: https://lab4-backend-autentisering.onrender.com/  
Eftersom Render har använts ligger servern vanligtvis i viloläge, vilket leder till att det tar en kort stund för att den ska vakna till liv.

## Installation, databas
API:et använder sig utav databasen MongoDB & Atlas.
Webbtjänsten använder Mongoose som hjälpmedel till databasen och inom katalogen models finns två scheman som visar strukturen över lagrad data. En dotenv-fil (.env.sample) finns för anslutningsmöjligheter. MongoDB skapar automatiskt ett ID till varje post som görs. Till exempel inom ett användarkonto. 
 
Klona ner källkodsfilerna, kör kommando npm install för att installera nödvändiga npm-paket.
Paket som använts i laborationen hittas i package.json under dependencies.

### Scheman
#### Användare:

| Fält          | Typ     | Beskrivning |
|---------------|----------|-------------|
| _id           | ObjectId | Automatiskt genererat ID |
| username      | String   | Användarnamn |
| email         | String   | Mejl-adress |
| password      | String   | Lösenord |
| account_created    | Date     | När kontot skapades |

#### Nyhetsinlägg:
| Fält          | Typ     | Beskrivning |
|---------------|----------|-------------|
| _id           | ObjectId | Automatiskt genererat ID |
| headline      | String   | Rubrik |
| content         | String   | Nyhetens innehåll |
| author      | String   | Skribent |
| created    | Date     | Publiceringsdatum |

## Användning
Beskrivning hur man når API:et på olika vis:

| Metod | Ändpunkt              | Beskrivning                                      |
|-------|------------------------|--------------------------------------------------|
| GET   | /                      | Välkomstmeddelande         |
| GET   | /api/news              | Hämtar nyhetsinlägg     |
| POST  | /api/news              | Skyddad route för att skapa ett nyhetsinlägg      |
| DELETE   | /api/news/:id       | Skyddad route för att radera ett nyhetsinlägg     |
| POST | /api/register    | Skapa en användare    |
| POST | /api/login       | Logga in en användare    |

En användare returneras/skickas som ett JSON-objekt med följande struktur:
```
 {
  "_id" : "69f9f5549bf12ce7cb0dfb09",
  "username" : "Filip-Miun",
  "email": "fibe2504@student.miun.se",
  "password": "$2b$10$66qpVucN1jQ5ZxqreW.bx.eDvZ.u/uwX8RxNFyGHRSKzPkoCffrNK",
  "account_created": "2026-05-05T13:49:08.776+00:00"
}
```

Ett nyhetsinlägg returneras/skickas som JSON-objekt med följande struktur:
```
 {
  "_id" : "69f9a19f137dbd1a21caebd9",
  "headline" : "Snart är det sommar!",
  "content": "Nu börjar fåglarna att kvittra och gatorna sopas. Äntligen kommer värmen! Välkommen dig läsare.",
  "author": "Filip",
  "account_created": "2026-05-05T07:51:59.522+00:00"
}
```

*Filip Bergander | Laboration 4 - Backend-baserad Webbutveckling - Mittuniversitet 2026*
