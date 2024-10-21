const User = require("../model/User");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const userController = {};

// 회원가입
userController.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    //비밀번호 확인
    if (!password) {
      throw new Error("비밀번호를 입력해주세요");
    }
    // e-mail 기준으로 유저를 좀 찾아줘
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("이미 가입이 된 유저 입니다.");
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt); // 비밀번호 DB에 해시를 저장 합니다 .
    const newUser = new User({ email, name, password: hash });
    await newUser.save();
    res.status(200).json({ status: "SUCCESS" });
  } catch (error) {
    res.status(400).json({ status: "FAIL", message: error.message });
  }
};

// 2. 로그인
// 이메일, PW 입력해서 보냄
// DB에 해당 이메일과 PW를 가진 유저가 있는지 확인
// 없으면 로그인 실패
// 있다면? 유저정보 + 토큰
// FE에서는 위의 정보를 저장

//1. 라우터 설정
//2. 유저 정보 읽어오기
//2-1 DB로부터 이메일로 유저 정보 가져오기
//2-2 DB에서 가져온 유저 정보의 PW와 FE에서 보내온 PW가 일치하는지 비교
//2-3 일치한다면? 토큰 발행 / 틀리면? 에러 발생
//3. 응답으로 유저정보 + 토큰

//로그인
userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }, "-createdAt -updatedAt -__v");
    if (user) {
      // 2-2 작업
      const isMatch = bcrypt.compareSync(password, user.password); // true
      if (isMatch) {
        const token = user.generateToken();
        return res.status(200).json({ status: "SUCCESS", user, token });
      }
    }
    throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
  } catch (error) {
    res.status(400).json({ status: "FAIL", message: error.message });
  }
};

module.exports = userController;
