import {
  DatabaseUserDto, InternalDatabaseVaultDto,
  NoteDto, NoteWithOwnerDto,
  QueryDto,
  TagDto, TagWithOwnerDto,
  TemplateDto, TemplateWithOwnerDto,
  UserDto,
  VaultDto,
  VaultWithOwnerDto
} from "@ben-ryder/athena-js-lib";
import {TestUserDto} from "../schemas/test-user.dto";

export const testEnvironmentVars = {
  ACCESS_TOKEN_SECRET: "ivfbaklhfvuaiebgkjearbgoebrgkjebgiskbgnbgihsbdkgbodjbgbkgjfddfd",
  ACCESS_TOKEN_EXPIRY: "7h",
  REFRESH_TOKEN_SECRET: "jvbfhru9h9iuebukhreuirbghkebrgouaerkbjgbfousfashkbgrieaobferge",
  REFRESH_TOKEN_EXPIRY: "7 days",
  PASSWORD_RESET_SECRET: "kjbzdorgbdguidrbgigibiubxfvigzsebxfzkhkzfvbizdbvjkbdvibhbvfzd",
  PASSWORD_RESET_EXPIRY: "10 mins",
  APP_REGISTRATION_ENABLED: true
}

/**
 * Test users.
 * These can be used to for authentication, access control testing etc.
 *
 * THIS IS THE ONLY PLACE WITH SOME COUPLING BETWEEN THE FRONT AND THE BACK END
 * IMPLEMENTATIONS AS THE USER PASSWORD AND SERVER PASSWORD ARE DIFFERENT, SO
 * CONSUMERS OF THIS DATA MUST DECIDE WHICH ONE THEY NEED TO USE FOR TESTING.
 */
export const testUsers: readonly TestUserDto[] = Object.freeze([
  {
    id: "90938b63-3b14-4b18-8185-b3cfa5de2d6a",
    username: "test1",
    email: "test1@example.com",
    password: "password",
    passwordHash: "$2a$12$BjTFHAACFkJrcA0I2ylIDeBGl1hiQDB6zlqHoLWzivzy7MTvAVWbu",
    passwordKey: "50124b67ac13958730ccb696b4ca50fa531dc903a29bf83a56bb22ea2bc1114941dc3d81bbda0ca7959101044908e9acab0be69184e981d3c9e6cfcdbfa8fc718375219b5264274e46ee35e4bed1a826ec8733892b3d0cbcf27af56140d30f0c4ce2b5b87d1b8bccd460373f6b07e561819c1060d87e0a6ed8086b5cda1b3e15",
    serverPassword: "8375219b5264274e46ee35e4bed1a826ec8733892b3d0cbcf27af56140d30f0c4ce2b5b87d1b8bccd460373f6b07e561819c1060d87e0a6ed8086b5cda1b3e1",
    masterKey: "50124b67ac13958730ccb696b4ca50fa531dc903a29bf83a56bb22ea2bc1114941dc3d81bbda0ca7959101044908e9acab0be69184e981d3c9e6cfcdbfa8fc71",
    encryptionKey: "5ffbb0d81831e8cae5bb2b1e66aadf19626ab75b8858d6f1ddbc377533cd33c5b22ca7b23bcfb8012a27e7133df3a83676ac6208142fff92c3eace80ce79eca1",
    encryptionSecret: "U2FsdGVkX18JFA9xwYGFCVQ98o4/m+vw4iK9g/8Vz4GuT6W8ULf86MBi+0LzgYfD6GY0FzZKANqTu7Zt9aVc5zeR3hTR9N2OyRWHPEFBLl/kGoZ+4NY3M4lgv00woKL/Eh6vMDxUsl2hLpCC8hsEd1wwpa73dckgnzp0E2sKJr/zAJwQhMDPqLo/ViQWODcQBU5Yrhji/5hfSGQrEVIH7w==",
    isVerified: true,
    createdAt: "2022-07-11T18:17:43.784Z",
    updatedAt: "2022-07-11T18:20:32.482Z"
  },
  {
    id: "73852037-a8fc-42ec-bf8f-9e7314e1eabc",
    username: "test2",
    email: "test2@example.com",
    password: "amazingpassword42",
    passwordHash: "$2a$12$WPnOyfns.Co0s/DIJh/DdeMv8bg4IYTsPEFo/YPdaBEKPQnT/uNMK",
    passwordKey: "1d33032f64604a02cf4241e2397bce7594d6beba11af279b3f029d27e3396b106b3dfa8e50ef1bfea5e5149526b99d76ecca50432f4d20abab56c8499a77726fabb82f12718ba15ce92ed9e8951b2a751cc6de2f8d85dcb820cf3d2ce5d87a4bd7989123f73eebd7c7d949761d8ddac0b0062751de1fc3058a5a2143a1abb083",
    serverPassword: "abb82f12718ba15ce92ed9e8951b2a751cc6de2f8d85dcb820cf3d2ce5d87a4bd7989123f73eebd7c7d949761d8ddac0b0062751de1fc3058a5a2143a1abb08",
    masterKey: "1d33032f64604a02cf4241e2397bce7594d6beba11af279b3f029d27e3396b106b3dfa8e50ef1bfea5e5149526b99d76ecca50432f4d20abab56c8499a77726f",
    encryptionKey: "91cb2c6bda94379a7806592ca1955b9118a8e2cd59a6c772e163ace02baef9ec1ada638fae508997321fc9e736dfa41017990b1d121d88a3baabcf2c9ff79b76",
    encryptionSecret: "U2FsdGVkX1/cRByjThbEEe1Mh8/fmBf9vFRqlNJEjrD0Q6m0+u0q1MXehrmRaZVi2rcVFWmgSeOo45QKD7u/Pww+RhFeGPKAMGI0HXi7AcV506rgWeDYElkkJE/k7zRAmQtMJraSbMF6KhZCseY3FvvRx/JmomEjtXww4dr70rWZ43u7RKG/JJhNotmw/Dw4pYS3vV1e+KpTHNpPIwW/5A==",
    isVerified: true,
    createdAt: "2022-07-11T18:17:43.784Z",
    updatedAt: "2022-07-11T18:17:43.784Z"
  },
  {
    id: "98f4cb22-7815-4785-b659-3285fb06dacf",
    username: "test3",
    email: "test3@example.com",
    password: "amazingpassword42",
    passwordHash: "$2a$12$l9N5AAFSrCG0/3e/NkBfIe0ZIMZsqs8jpA2H4ggS.wn.dPSvm/BG6",
    passwordKey: "162c7bb10d2e6a613bca2c2ce0f27403f11eed0bd67a0ece0d66e02c8d428fffe88d5ad3b7c120a78ca3dbb04d4615fc56fd13c653fdad8fc139fffcf5cff53ec12839374d464214f64e9ce2d7f9eb93cf8f8fd66cea4d448df5dc025f316bc666b0813ec5c4110389dabb1bd68e13e14bb2c3d75877322c06200c8c5515a425",
    serverPassword: "c12839374d464214f64e9ce2d7f9eb93cf8f8fd66cea4d448df5dc025f316bc666b0813ec5c4110389dabb1bd68e13e14bb2c3d75877322c06200c8c5515a42",
    masterKey: "162c7bb10d2e6a613bca2c2ce0f27403f11eed0bd67a0ece0d66e02c8d428fffe88d5ad3b7c120a78ca3dbb04d4615fc56fd13c653fdad8fc139fffcf5cff53e",
    encryptionKey: "d55ddf4b314b377b75685d76aea76856cdfbcf16d1e86d19f9d626cf1d172833598966b5667c7d94fe657e8ba725f4dbba54518e6d9befcf2ebb7c41e73ab7f8",
    encryptionSecret: "U2FsdGVkX1/QqfUbZJGc9icpxOdL2j5/wcdeUVzrcva/3P1Eb1zYbzQveq/Uq65EdyPYiKDdCynITLzFfJyAMCZMcneCUt+YH2Yw1s1+eOLXUOri+pq4AyPYA2HyqBMgJFeNR9s0tkRQCkJ/o8/lHjQ0zcOMEB1cxhK/4+i1KZnwweGKo7n1eqG39vQ1HFc5Edz07mfO0hvm6M7cIgzTIg==",
    isVerified: false,
    createdAt: "2022-07-11 20:15:20.301649",
    updatedAt: "2022-07-11 20:34:12.274037"
  }
]);

export interface TestNoteDto extends NoteWithOwnerDto {
  vault: string
}

export interface TestData {
  [userId: string]: {
    vaults: VaultWithOwnerDto[],
    notes: TestNoteDto[],
    templates: TemplateWithOwnerDto[],
    tags: TagWithOwnerDto[],
    queries: QueryDto[],
    notesTags: [],
    templatesTags: [],
    queriesTags: []
  }
}

const user1tags: readonly TagWithOwnerDto[] = Object.freeze([
  {
    id: "3fed9d5d-28a0-40a7-bcc6-880b9ea7a0e3",
    name: "U2FsdGVkX1/o71el8W8GQjvWCqUn3zbV8NvmtfwU4SQ=",
    backgroundColour: "#f00",
    textColour: "#000",
    createdAt: "2022-07-11T18:20:32.482Z",
    updatedAt: "2022-07-11T18:20:32.482Z",
    owner: testUsers[0].id
  },
  {
    id: "9cda0043-e4fb-4ee6-8973-6cdf72e030c5",
    name: "U2FsdGVkX18OX7d6vXrujb3jxDMnWEW9zsW6a6g0OTA=",
    backgroundColour: "#fff",
    textColour: "#000",
    createdAt: "2022-07-11T18:20:32.482Z",
    updatedAt: "2022-07-11T18:20:32.482Z",
    owner: testUsers[0].id
  },
  {
    id: "55df2983-de19-479d-b381-b23864310643",
    name: "U2FsdGVkX1/Ja4aGSpK62f/gOJCyB77tV12ZLPhXUFs=",
    backgroundColour: "#00f",
    textColour: "#fff",
    createdAt: "2022-07-11T18:20:32.482Z",
    updatedAt: "2022-07-11T18:20:32.482Z",
    owner: testUsers[0].id
  },
  {
    id: "e3d7f338-1b6c-4a8c-9624-30c38e75647a",
    name: "U2FsdGVkX19sLab6aRzLMRytTtR5uF4ez9ToBaiasEo=",
    backgroundColour: null,
    textColour: null,
    createdAt: "2022-07-11T18:20:32.482Z",
    updatedAt: "2022-07-11T18:20:32.482Z",
    owner: testUsers[0].id
  }
]);

export const testData: TestData = {
  [testUsers[0].id]: {
    vaults: [
      {
        id: "0ae6ecb4-fea6-4689-ba08-eff2afdf67d2",
        name: "U2FsdGVkX1/fYFhhoAtVmrOvVcu1OTX7rdEByL0/Dyg=",
        description: "U2FsdGVkX1+UVyIXr+TpZ4LWLse4c7ourMtl2uVGI0grBZ5a4QFpnbhw/gAJjb/i",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[0].id
      },
      {
        id: "01b31e76-aac8-4c41-9a75-d9cfc6fad860",
        name: "U2FsdGVkX1+VV1mvqRf0BTBZIJaKOIb5HVxVud0auEk=",
        description: "U2FsdGVkX18P/uTSK8EDhYW4EfjPZAWgnH3TrOVvPwnKIK/jkfm7bN7INP7QGxmJ",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[0].id
      },
      {
        id: "14df9d88-f572-4283-a288-5e2e8c3b154f",
        name: "U2FsdGVkX19fE+q5VTG3aBuHmMUTy7yWyCyDUZ3qgyM=",
        description: "U2FsdGVkX1/0fc7tOiEHMzY/u4dUtiLSBVoa9G90TA9YEIzvJ/AF/XQDojmd8XqA",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[0].id
      },
      {
        id: "6fc96055-0acb-4e70-910e-d9b98b35c7b1",
        name: "U2FsdGVkX1+nNFW037zK0db8K85GQDpEe3gcei5/LFk=",
        description: "U2FsdGVkX1/0fc7tOiEHMzY/u4dUtiLSBVoa9G90TA9YEIzvJ/AF/XQDojmd8XqA",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[0].id
      },
      {
        id: "16ce7b81-a99e-4b43-b74f-9950a0ca8ee4",
        name: "U2FsdGVkX18bN+WIunMkL/bu/Mv1Hd61SCUol1sqNEw=",
        description: "U2FsdGVkX1/0fc7tOiEHMzY/u4dUtiLSBVoa9G90TA9YEIzvJ/AF/XQDojmd8XqA",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[0].id
      },
      {
        id: "9220b28e-2104-4c2a-b343-b55a3d776ad0",
        name: "U2FsdGVkX1/+YSrTTNiaEGQl2GWXPmvNRDLmFrGprtQ=",
        description: "U2FsdGVkX1/0fc7tOiEHMzY/u4dUtiLSBVoa9G90TA9YEIzvJ/AF/XQDojmd8XqA",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[0].id
      },
      {
        id: "fcb9bddd-7aaf-4989-b2cf-6d8462e647e5",
        name: "U2FsdGVkX1/8CcbxZbhdOGpF0LOf1kJxiBGXVt/2B4c=",
        description: "U2FsdGVkX1/0fc7tOiEHMzY/u4dUtiLSBVoa9G90TA9YEIzvJ/AF/XQDojmd8XqA",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[0].id
      }
    ],
    notes: [
      {
        id: "b6bffa00-4c5a-489b-8610-33498a46e12a",
        title: "U2FsdGVkX19ao2tc+hyvxjolT7EdkuDIPuTiY/bqBUU=",
        description: null,
        body: "U2FsdGVkX18ITU4Gx+eDFE/mC+iQNVXAcjGn96rQDDj84ZNuDH5eAGcWxHaUHLcq",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        tags: [...user1tags],
        vault: "0ae6ecb4-fea6-4689-ba08-eff2afdf67d2",
        owner: testUsers[0].id
      },
      {
        id: "e2b11951-86ba-4782-a38a-8bffae0e46b3",
        title: "U2FsdGVkX18p2PiX1jv9xqt45Zw4gSaNLwGVFcdMOTk=",
        description: null,
        body: "U2FsdGVkX1+8Zu1ikXgqgpprfbw6L6s5j+90lHVBU2b5OkImZYnUfbsPv8cLp+1x",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        tags: [user1tags[0], user1tags[1]],
        vault: "0ae6ecb4-fea6-4689-ba08-eff2afdf67d2",
        owner: testUsers[0].id
      },
      {
        id: "7258816f-f992-47ff-943f-4b1eaf605c74",
        title: "U2FsdGVkX18fDAVizK6fNrtNgqQCNFAzl1E8StwD7Cs=",
        description: null,
        body: "U2FsdGVkX1/TCEi3UYAqgyXXttzRvCUlRd7f7pmBkhM4pNvYPZV/ug9uEv5oD8SA",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        tags: [user1tags[0], user1tags[3]],
        vault: "0ae6ecb4-fea6-4689-ba08-eff2afdf67d2",
        owner: testUsers[0].id
      },
      {
        id: "21955bea-03a5-47a6-9804-fe9588cf67a2",
        title: "U2FsdGVkX18SOpg3O/ud/OgMtEbuY8lWOW/XUn1/7V0=",
        description: null,
        body: "U2FsdGVkX18SGmDJG3UjGN8IIQb+BLuA/j4At97pqSGz7dm4/Cm4Mbqz3qol7UTN",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        tags: [user1tags[1], user1tags[2]],
        vault: "0ae6ecb4-fea6-4689-ba08-eff2afdf67d2",
        owner: testUsers[0].id
      },
      {
        id: "56f48fb0-1fa2-4e95-bdf1-dfa7dd9da221",
        title: "U2FsdGVkX1+0AsFPOlTgTtiO2ExFXx9OA77u2bPXfY8=",
        description: null,
        body: "U2FsdGVkX1941OgPfWmjgYz3pKQAQvsohsMCOcg534VYICfyTggqCJ6HLCYplyQU",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        tags: [user1tags[3]],
        vault: "0ae6ecb4-fea6-4689-ba08-eff2afdf67d2",
        owner: testUsers[0].id
      }
    ],
    templates: [],
    tags: [...user1tags],
    queries: [],
    notesTags: [],
    queriesTags: [],
    templatesTags: []
  },
  [testUsers[1].id]: {
    vaults: [
      {
        id: "def2be1e-e5e5-43ec-9537-c48d03628670",
        name: "U2FsdGVkX19UFfrvgTtTNXLeO6K6/CxDld+qjwOJ8lw=",
        description: "U2FsdGVkX1/PottBXRyUqkEc5pRS955KhmUAsdLVPRk3VjLDeb/+mvGrnI4uZPv3",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[1].id
      },
      {
        id: "6afc2ee9-c5c8-4018-9d03-67fbf4a7b172",
        name: "U2FsdGVkX19Qr8OE243rlobc+whHRKIdHbYK2Nv3s78=",
        description: "U2FsdGVkX198PWAHv18sgNJpulj+Gw0/5268kV3dSWASenXIS2lCPM77v5Lm9gaR",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[1].id
      },
    ],
    notes: [],
    templates: [],
    tags: [],
    queries: [],
    notesTags: [],
    queriesTags: [],
    templatesTags: []
  },
  [testUsers[2].id]: {
    vaults: [
      {
        id: "eace9d71-ce66-4254-9cf5-1799c2ea2890",
        name: "U2FsdGVkX1+FBRkBa5vwgmdPny/rzSm/GRisogGZVh4=",
        description: "U2FsdGVkX18kLHhliDj7mW8wR5ze4vhkejZgoccUOl67GOFcYY19VHAsFNxvXJF1",
        createdAt: "2022-07-11T18:20:32.482Z",
        updatedAt: "2022-07-11T18:20:32.482Z",
        owner: testUsers[2].id
      }
    ],
    notes: [],
    templates: [],
    tags: [],
    queries: [],
    notesTags: [],
    queriesTags: [],
    templatesTags: []
  }
};
